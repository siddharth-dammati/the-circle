import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/dashboard", "/discover", "/matches", "/chat", "/admin", "/api"],
      },
    ],
    sitemap: "https://gitamate.vercel.app/sitemap.xml",
  };
}
