import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // experimental: {
  //   outputFileTracingRoot: undefined,
  // },
  images: {
    domains: ["img.youtube.com", "scontent.cdninstagram.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
