"use client";

import { useEffect, useState } from "react";

import PromoBar from "../components/Header/PromoBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loading";
import NavgrahBracelets from "../components/NavgrahBracelets/NavgrahBracelets";

import type { RashiBracelet } from "../data/Rashibracelets";
import type { BlogPost } from "../data/Blog";

import { fetchFeaturedRashiBracelets } from "../lib/productApi";
import { fetchPosts } from "../lib/blogApi";

const MIN_LOADER_MS = 1600;

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  const [rashiBracelets, setRashiBracelets] =
    useState<RashiBracelet[]>([]);

  const [posts, setPosts] =
    useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const startedAt = Date.now();

      try {
        console.log("================================");
        console.log("🏠 HOME PAGE DATA LOAD");
        console.log("================================");

        const [productsResult, postsResult] =
          await Promise.allSettled([
            fetchFeaturedRashiBracelets(8),
            fetchPosts({ limit: 6 }),
          ]);

        if (cancelled) {
          return;
        }

        // PRODUCTS
        if (productsResult.status === "fulfilled") {
          console.log(
            "🛍️ Homepage products:",
            productsResult.value
          );

          setRashiBracelets(
            productsResult.value
          );
        } else {
          console.error(
            "❌ Homepage products failed:",
            productsResult.reason
          );

          setRashiBracelets([]);
        }

        // BLOGS
        if (postsResult.status === "fulfilled") {
          console.log(
            "📝 Homepage blogs:",
            postsResult.value
          );

          setPosts(
            postsResult.value.posts ?? []
          );
        } else {
          console.error(
            "❌ Homepage blogs failed:",
            postsResult.reason
          );

          setPosts([]);
        }
      } catch (error) {
        console.error(
          "❌ Homepage data loading failed:",
          error
        );
      } finally {
        if (cancelled) return;

        const elapsed =
          Date.now() - startedAt;

        const remaining = Math.max(
          0,
          MIN_LOADER_MS - elapsed
        );

        setTimeout(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        }, remaining);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF7F1]">
        <Loader />
      </main>
    );
  }

  console.log(
    "🏠 Rendering homepage:",
    {
      products: rashiBracelets.length,
      posts: posts.length,
    }
  );

  return (
    <main>
      <PromoBar />

      <Navbar />

      <NavgrahBracelets
        rashiBracelets={rashiBracelets}
        posts={posts}
      />

      <Footer />
    </main>
  );
}
