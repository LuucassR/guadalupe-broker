import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
