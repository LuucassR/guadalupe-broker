import type { QuoteInput, QuoteProvider, ProviderQuoteResult } from "./types";
import { sancorProvider } from "./sancor";
import { cooperacionProvider } from "./cooperacion";

// Unico lugar donde se registra un proveedor nuevo: agregar su `xProvider` aca.
const PROVIDERS: QuoteProvider[] = [sancorProvider, cooperacionProvider];

export function getProviders(): QuoteProvider[] {
  return PROVIDERS;
}

export function getEnabledProviders(): QuoteProvider[] {
  return PROVIDERS.filter((p) => p.enabled());
}

export function getProvider(id: string): QuoteProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

// Cotiza contra todos los proveedores habilitados en paralelo. Si uno falla
// (throw, timeout, non-2xx) su resultado queda { ok:false, error } y no tumba
// al resto del batch.
export async function quoteAll(
  input: QuoteInput,
): Promise<ProviderQuoteResult[]> {
  return Promise.all(getEnabledProviders().map((p) => runProvider(p, input)));
}

export async function runProvider(
  provider: QuoteProvider,
  input: QuoteInput,
): Promise<ProviderQuoteResult> {
  try {
    return await provider.quote(input);
  } catch (err) {
    return {
      providerId: provider.id,
      providerName: provider.name,
      ok: false,
      plans: [],
      error:
        err instanceof Error ? err.message : "Error consultando el proveedor",
    };
  }
}
