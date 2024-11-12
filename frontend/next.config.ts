import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
      {
        protocol: "https",
        hostname: "example.com"
      }, {
        protocol: "https",
        hostname: "picsum.photos"
      }
    ],
  },
};

export default nextConfig;
