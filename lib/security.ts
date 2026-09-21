import { NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// Rate limit en memoria: es por instancia del servidor (best-effort). Frena
// spam y abuso basico; para un limite global usar un store compartido (Redis/Upstash).
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;
const DEFAULT_MAX_BODY_BYTES = 100_000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function hitRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSec: 0 };
  }
  bucket.count += 1;
  return {
    limited: bucket.count > limit,
    retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/**
 * Chequeos comunes de las rutas /api: origen (solo metodos que escriben),
 * tamano del body y rate limit por IP. Devuelve la respuesta de rechazo o null.
 */
export function guardRequest(
  request: Request,
  opts: {
    name: string;
    limit: number;
    windowMs: number;
    maxBodyBytes?: number;
  },
): NextResponse | null {
  const writes = request.method !== "GET" && request.method !== "HEAD";

  if (writes && !isSameOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (writes && length > (opts.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES)) {
    return NextResponse.json({ error: "Solicitud demasiado grande" }, { status: 413 });
  }

  const { limited, retryAfterSec } = hitRateLimit(
    `${opts.name}:${clientIp(request)}`,
    opts.limit,
    opts.windowMs,
  );
  if (limited) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
    );
  }

  return null;
}
