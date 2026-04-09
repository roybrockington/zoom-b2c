import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.sound-service.eu',
      },
    ],
  },
};

export default nextConfig;

