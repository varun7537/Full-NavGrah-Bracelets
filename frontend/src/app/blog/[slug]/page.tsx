import { notFound } from "next/navigation";
import { fetchPost, fetchRelatedPosts } from "../../../lib/blogApi";
import BlogPostClient from "../../../components/Blog/BlogPostClient";

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const relatedPosts = await fetchRelatedPosts(slug, 3);
  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}