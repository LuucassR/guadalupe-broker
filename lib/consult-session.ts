// Id de la "consulta" en curso del navegador. Se manda en el header
// x-consult-session para que el servidor agrupe todas las llamadas a la API de
// un mismo cliente en una sola fila (ver lib/consult-log.ts). Vive en
// sessionStorage: dura lo que la pestana y no se comparte entre pestanas.
import { getVisitorId } from "@/lib/visitor";

const KEY = "gb-consult-session";

export function getConsultSessionId(): string | undefined {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

// Al retomar una cotizacion guardada, se sigue con su misma consulta.
export function adoptConsultSessionId(id: string) {
  try {
    sessionStorage.setItem(KEY, id);
  } catch {}
}

// Al empezar una cotizacion nueva, la siguiente consulta es una fila aparte.
export function resetConsultSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

export function consultHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers = { ...extra };
  const session = getConsultSessionId();
  const visitor = getVisitorId();
  if (session) headers["x-consult-session"] = session;
  if (visitor) headers["x-visitor-id"] = visitor;
  return headers;
}
