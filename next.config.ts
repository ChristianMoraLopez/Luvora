import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product photography will typically live in Supabase Storage.
    // Add your project ref host here once created, e.g. "xxxx.supabase.co".
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Keeps framer-motion / lottie payloads lean in the App Router.
    optimizePackageImports: ["framer-motion", "lottie-react"],
  },
};

export default nextConfig;
