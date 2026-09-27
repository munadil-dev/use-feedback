import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */

const nextConfig = {
  agentRules: false,
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
