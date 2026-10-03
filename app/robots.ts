import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000/";

  return {
    rules: {
      userAgent: "*",
      // The widget script runs on customer sites, so crawlers need it to see the reviews.
      allow: ["/", "/api/embed-reviews"],
      disallow: ["/dashboard", "/api/", "/auth/"],
    },
    sitemap: `${baseUrl}sitemap.xml`,
  };
}
