import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "k1.youtrack.cloud" },
      { hostname: "utfs.io" },
      // needed for fake data
      { hostname: "cdn.jsdelivr.net" },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
