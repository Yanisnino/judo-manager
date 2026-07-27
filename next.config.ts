import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow all origins for mobile PWA access
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.35",
    "*.vercel.app",
  ],
};

export default nextConfig;
