import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add basePath for path-based routing (e.g., /sirr)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Output standalone build for Docker deployment
  output: 'standalone',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Configure image domains if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
