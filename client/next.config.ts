import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  // Output configuration for standalone deployment (Docker, etc.)
  // Uncomment the line below if deploying as standalone (e.g., Docker)
  // output: "standalone",
};

export default nextConfig;
