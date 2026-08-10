import { SITE_URL } from "@/config/api";

const siteUrl = SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
