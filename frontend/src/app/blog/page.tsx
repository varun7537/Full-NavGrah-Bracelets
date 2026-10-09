import type { Metadata } from "next";
import { fetchPosts } from "../../lib/blogApi";
import BlogListClient from "../../components/Blog/BlogListClient";
import type { BlogPost } from "../../data/Blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Journal | Guides on Rashis, Gemstones & Bracelet Care",
  description:
    "Guides on rashis, gemstones and bracelet care, written to help you choose with confidence.",
};

export default async function BlogIndexPage() {
  let posts: BlogPost[] = [];

  try {
    // Listing page par saare posts chahiye, isliye limit bada rakha hai.
    const result = await fetchPosts({ limit: 100 });
    posts = result.posts ?? [];
  } catch (error) {
    // API fail ho to page crash na ho, empty state dikhega.
    console.error("[BlogIndexPage] Failed to fetch posts:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      <BlogListClient posts={posts} />
    </main>
  );
}
// import { fetchFeaturedRashiBracelets } from "../../lib/productApi";
// import { fetchPosts } from "../../lib/blogApi";
// import RashiBraceletsContainer from "../../components/ShopByPlanets/RashiBraceletsContainer";
// import BlogSectionContainer from "../../components/Blog/BlogSectionContainer";

// export const revalidate = 60;

// export default async function HomePage() {
//   // Dono requests ek saath chalti hain
//   const [rashiBracelets, { posts }] = await Promise.all([
//     fetchFeaturedRashiBracelets(8),
//     fetchPosts({ limit: 6 }),
//   ]);

//   return (
//     <>
//       {/* ...baaki home sections... */}

//       <RashiBraceletsContainer products={rashiBracelets} />

//       <BlogSectionContainer posts={posts} limit={3} />

//       {/* ...baaki home sections... */}
//     </>
//   );
// }