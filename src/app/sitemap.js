import { SITE_URL } from "@/config/api";
import { blogPosts, getPostPublishedAt, normalizeName } from "@/data/blogData";

const siteUrl = SITE_URL || "http://localhost:3000";

export default function sitemap() {
  const latestPostDate = getPostPublishedAt(blogPosts[0]) || new Date().toISOString();

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/noticias`, lastModified: latestPostDate, changeFrequency: "daily", priority: 0.9 },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/noticias/${normalizeName(post.name)}`,
      lastModified: getPostPublishedAt(post) || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
