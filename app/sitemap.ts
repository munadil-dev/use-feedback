import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000/";

  return [
    { url: baseUrl },
    ...source
      .getPages()
      .map((page) => ({ url: `${baseUrl}${page.url.slice(1)}` })),
  ];
}
