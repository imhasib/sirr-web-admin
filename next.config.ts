import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SIRR_PUBLIC_API_URL: process.env.SIRR_PUBLIC_API_URL ?? '',
    SIRR_PUBLIC_APP_NAME: process.env.SIRR_PUBLIC_APP_NAME ?? '',
    SIRR_PUBLIC_APP_URL: process.env.SIRR_PUBLIC_APP_URL ?? '',
  },

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
