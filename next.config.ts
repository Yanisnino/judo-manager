import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.35",
  ],
};

export default nextConfig;
