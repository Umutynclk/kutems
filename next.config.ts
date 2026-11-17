import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kutems-media.pages.dev",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;
