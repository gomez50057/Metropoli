"use client";
import BlogHeader from "./BlogHeader";
import BlogNoticias from "./BlogNoticias";
import UltimasNoticias from "./UltimasNoticias";
import { blogPosts } from "../../utils/blogData";

const BlogMain = () => {
  const featured = blogPosts.filter(p => p.featuredPosts === true);

  return (
    <div>
      <BlogHeader />
      <UltimasNoticias posts={blogPosts.slice(0, 4)} />
      <BlogNoticias posts={blogPosts} featuredPosts={featured} />
    </div>
  );
};

export default BlogMain;
