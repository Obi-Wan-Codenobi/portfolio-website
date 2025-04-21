import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // Optional: Add these configurations for more control
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  reactStrictMode: true,
};

export default nextConfig;
