import type { MetadataRoute } from "next";

function siteUrl() {
  return (process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/account", "/cart", "/checkout"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
