"use client";

import { useRouter } from "next/navigation";
import { BlogPost } from "../../data/Blog";
import BlogPage from "./BlogPage";

export default function BlogPostClient({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const router = useRouter();
  return (
    <BlogPage
      post={post}
      relatedPosts={relatedPosts}
      onBack={() => router.push("/blog")}
      onOpenPost={(p) => router.push(`/blog/${p.slug}`)}
      onShopRashi={(rashiId) => router.push(`/products?rashi=${rashiId}`)}
    />
  );
}