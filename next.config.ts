import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "k1.youtrack.cloud" },
      { hostname: "utfs.io" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "/output"),
};

export default nextConfig;
