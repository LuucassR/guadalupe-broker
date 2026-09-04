"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatPriceARS } from "@/lib/pricing";

// Una columna de cotizacion en linea por aseguradora en el paso 2 del flujo Auto.
// Llama a `POST /api/quote?provider=<id>` y muestra los precios /mes que devuelve
// ese `QuoteProvider`. Agregar una aseguradora a la UI = un item mas en
// `PROVIDER_COLUMNS` (el adapter y su alta en lib/quote-providers/registry.ts van
// por separado, ver docs/quote-providers.md).

// Subset de QuoteInput: lo que el Cotizador ya tiene a mano en el paso 2.
export interface ProviderColumnInput {
  vehicleType: "Auto" | "Moto";
  brand: string;
  model: string;
  version?: string;
  year: number;
  vehicleValueARS: number;
  hasGnc: boolean;
  postalCode: string;
  // Id de la version del catalogo CCA elegida: lo usan los adapters que traducen
  // el auto a su propio codigo de catalogo (ver lib/quote-providers/vehicle-xref.ts).
  catalogVersionId?: number;
}

export interface ProviderColumn {
  id: string; // == QuoteProvider.id, se usa en ?provider=<id>
  name: string;
  brandColor: string;
  logoUrl: string;
  wordmark: string; // fallback si el logo no carga
  unavailableCopy: string;
}

export const PROVIDER_COLUMNS: ProviderColumn[] = [
  {
    id: "sancor",
    name: "Sancor Seguros",
    brandColor: "#AF1685", // magenta de marca
    logoUrl: "/logos/sancor-seguros.png",
    wordmark: "SANCOR SEGUROS",
    unavailableCopy:
      "La cotización en línea de Sancor no está disponible en este momento. Tu asesor la confirma junto con el resto de las compañías.",
  },
  {
    id: "cooperacion",
    name: "Cooperación Seguros",
    brandColor: "#3AAA35", // verde de marca (aprox.)
    logoUrl: "/logos/cooperacion-seguros.png",
    wordmark: "COOPERACIÓN SEGUROS",
    unavailableCopy:
      "La cotización en línea de Cooperación no está disponible en este momento. Tu asesor la confirma junto con el resto de las compañías.",
  },
];

interface Plan {
  planId: string;
  planName: string;
  monthlyPremium: number | null;
}

type Status = "loading" | "unavailable" | "ok";

interface Fetched {
  key: string;
  status: Exclude<Status, "loading">;
  plans: Plan[];
}

export default function ProviderQuoteColumn({
  provider,
  input,
}: {
  provider: ProviderColumn;
  input: ProviderColumnInput;
}) {
  const [fetched, setFetched] = useState<Fetched | null>(null);
  const [logoError, setLogoError] = useState(false);

  // El body de la request solo depende de estos campos: lo serializamos para que
  // el efecto no se dispare en cada render por una nueva referencia de objeto.
  const bodyKey = useMemo(() => JSON.stringify(input), [input]);

  // Mientras el resultado cacheado no corresponda al input actual, estamos
  // cargando (estado derivado, sin setState al inicio del efecto).
  const isCurrent = fetched?.key === bodyKey;
  const status: Status = isCurrent ? fetched.status : "loading";
  const plans = isCurrent ? fetched.plans : [];

  useEffect(() => {
    let active = true;
    fetch(`/api/quote?provider=${provider.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyKey,
    })
      .then((r) => r.json())
      .then((json) => {
        if (!active) return;
        const result = json?.data?.[0];
        const ok =
          result?.ok && Array.isArray(result.plans) && result.plans.length > 0;
        setFetched({
          key: bodyKey,
          status: ok ? "ok" : "unavailable",
          plans: ok ? result.plans : [],
        });
      })
      .catch(
        () =>
          active &&
          setFetched({ key: bodyKey, status: "unavailable", plans: [] }),
      );
    return () => {
      active = false;
    };
  }, [bodyKey, provider.id]);

  return (
    <div
      className="min-w-0 border border-gray-200"
      data-testid={`${provider.id}-column`}
    >
      <div
        className="flex min-h-14 items-center justify-center p-2"
        style={{ backgroundColor: provider.brandColor }}
      >
        {/* El logo va sobre una pastilla blanca: los PNG de las aseguradoras
            vienen con fondo (o casi sin transparencia), así que un truco de
            `invert` los rompe. En blanco se ven con sus colores reales. */}
        <div className="flex h-10 w-full items-center justify-center rounded bg-white px-3">
          {logoError ? (
            <span
              className="truncate text-xs font-extrabold tracking-tight sm:text-sm"
              style={{ color: provider.brandColor }}
            >
              {provider.wordmark}
            </span>
          ) : (
            <Image
              src={provider.logoUrl}
              alt={provider.name}
              width={200}
              height={40}
              unoptimized
              onError={() => setLogoError(true)}
              className="max-h-8 w-auto max-w-full object-contain"
            />
          )}
        </div>
      </div>

      <div className="p-4">
        {status === "loading" && (
          <div className="flex justify-center py-4">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          </div>
        )}

        {status === "unavailable" && (
          <p className="text-xs leading-relaxed text-gray-500">
            {provider.unavailableCopy}
          </p>
        )}

        {status === "ok" && (
          <ul className="space-y-2.5">
            {plans.map((p) => (
              <li
                key={p.planId}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <span className="min-w-0 text-xs font-medium wrap-break-word text-gray-700">
                  {p.planName}
                </span>
                <span
                  className="text-sm font-bold whitespace-nowrap"
                  style={{ color: provider.brandColor }}
                >
                  {p.monthlyPremium != null
                    ? `${formatPriceARS(p.monthlyPremium)}/mes`
                    : "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
