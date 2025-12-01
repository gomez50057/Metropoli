import { notFound } from "next/navigation";
import FullPost from "../../../components/blog/FullPost";
import { blogPosts, normalizeName } from "../../../utils/blogData";

export async function generateStaticParams() {
  return blogPosts.map(p => ({ name: normalizeName(p.name) }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const slug = normalizeName(decodeURIComponent(Array.isArray(name) ? name[0] : name));
  const post = blogPosts.find(p => normalizeName(p.name) === slug);
  if (!post) return { title: "Post no encontrado" };
  const desc = (post.description || "").replace(/\n+/g, " ").slice(0, 160);
  return { title: post.name, description: desc };
}

export default async function PostPage({ params }) {
  const { name } = await params;
  const slug = normalizeName(decodeURIComponent(Array.isArray(name) ? name[0] : name));

  const post = blogPosts.find(p => normalizeName(p.name) === slug);
  if (!post) notFound();

  return (
    <div>
      <FullPost post={post} featuredPosts={blogPosts} />
    </div>
  );
}
