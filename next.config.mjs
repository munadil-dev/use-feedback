import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */

const nextConfig = {
  agentRules: false,
  async rewrites() {
    return [
      { source: "/api/embed-feedbacks", destination: "/api/embed-reviews" },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
