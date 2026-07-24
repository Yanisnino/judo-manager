import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: fontBuildIgnore(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

function fontBuildIgnore() {
  return true;
}

export default nextConfig;
