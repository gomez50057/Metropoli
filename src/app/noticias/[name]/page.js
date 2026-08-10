import { notFound } from "next/navigation";
import FullPost from "@/features/blog/components/FullPost";
import { SITE_URL } from "@/config/api";
import {
  blogPosts,
  getPostAuthor,
  getPostExcerpt,
  getPostImageAlt,
  getPostPublishedAt,
  normalizeName,
} from "@/data/blogData";

const siteUrl = SITE_URL || "http://localhost:3000";

export async function generateStaticParams() {
  return blogPosts.map(p => ({ name: normalizeName(p.name) }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const slug = normalizeName(decodeURIComponent(Array.isArray(name) ? name[0] : name));
  const post = blogPosts.find(p => normalizeName(p.name) === slug);
  if (!post) return { title: "Post no encontrado" };
  const description = getPostExcerpt(post);
  const articleUrl = `/noticias/${slug}`;

  return {
    title: `${post.name} | Metrópoli Hidalgo`,
    description,
    alternates: { canonical: articleUrl },
    openGraph: {
      title: post.name,
      description,
      url: articleUrl,
      type: "article",
      publishedTime: getPostPublishedAt(post) || undefined,
      images: [{ url: post.image, alt: getPostImageAlt(post) }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }) {
  const { name } = await params;
  const slug = normalizeName(decodeURIComponent(Array.isArray(name) ? name[0] : name));

  const post = blogPosts.find(p => normalizeName(p.name) === slug);
  if (!post) notFound();

  const publishedAt = getPostPublishedAt(post);
  const articleUrl = `${siteUrl}/noticias/${slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.name,
    description: getPostExcerpt(post),
    image: [`${siteUrl}${post.image}`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    author: {
      "@type": "Organization",
      name: getPostAuthor(post),
    },
    publisher: {
      "@type": "Organization",
      name: "Metrópoli Hidalgo",
      url: siteUrl,
    },
    ...(publishedAt ? { datePublished: publishedAt, dateModified: publishedAt } : {}),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <FullPost post={post} featuredPosts={blogPosts} />
    </div>
  );
}
