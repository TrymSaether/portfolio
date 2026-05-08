import type { MetadataRoute } from "next";
import { stations } from "@/content/stations";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";

const BASE = "https://trymsaether.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...stations.map((s) => ({
      url: `${BASE}${s.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...notes.map((n) => ({
      url: `${BASE}/notes/${n.slug}`,
      lastModified: new Date(n.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
