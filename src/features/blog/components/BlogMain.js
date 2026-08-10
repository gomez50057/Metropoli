"use client";

import { Suspense } from "react";
import BlogHeader from "./BlogHeader";
import BlogNoticias from "./BlogNoticias";
import UltimasNoticias from "./UltimasNoticias";
import { blogPosts } from "@/data/blogData";

const BlogMain = () => {
  const featured = blogPosts.filter(p => p.featuredPosts === true);

  return (
    <div>
      <BlogHeader />
      <UltimasNoticias posts={blogPosts.slice(0, 4)} />
      <Suspense fallback={null}>
        <BlogNoticias posts={blogPosts} featuredPosts={featured} />
      </Suspense>
    </div>
  );
};

export default BlogMain;
