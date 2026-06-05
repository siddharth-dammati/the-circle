import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // @ts-ignore
  allowedDevOrigins: [
    "comes-justify-contrary-gathering.trycloudflare.com",
    "sweet-kids-design.loca.lt"
  ],
};

export default nextConfig;
