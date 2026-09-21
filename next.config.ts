import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Solo en produccion: en dev, React/HMR necesitan eval y websockets, y el
// preview del editor embebe la app en un iframe (frame-ancestors lo bloquearia).
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://img.magnific.com https://www.guadalupebroker.com.ar",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  ...(isProd
    ? [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.guadalupebroker.com.ar",
      },
    ],
  },
  allowedDevOrigins: ["unadvocated-justus-opticly.ngrok-free.dev"],
};

export default nextConfig;
