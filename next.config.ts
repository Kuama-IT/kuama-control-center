import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "k1.youtrack.cloud" },
      { hostname: "utfs.io" },
    ],
  },
};

export default nextConfig;
