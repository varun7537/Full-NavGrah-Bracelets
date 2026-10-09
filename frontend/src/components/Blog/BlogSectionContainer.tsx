"use client";

import { useRouter } from "next/navigation";
import type { BlogPost } from "../../data/Blog";
import BlogSection from "./BlogSection";

export default function BlogSectionContainer({
  posts,
  limit = 3,
}: {
  posts: BlogPost[];
  limit?: number;
}) {
  const router = useRouter();

  return (
    <BlogSection
      posts={posts}
      limit={limit}
      onOpenPost={(post) => router.push(`/blog/${post.slug}`)}
      onViewAll={() => router.push("/blog")}
    />
  );
}