import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/yoy",
  // Required to bundle @google-cloud/bigquery only on the server
  serverExternalPackages: ["@google-cloud/bigquery"],
};

export default nextConfig;
