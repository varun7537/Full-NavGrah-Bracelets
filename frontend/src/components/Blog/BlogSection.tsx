"use client";

import styles from "../../styles/Braceletscollection.module.css";
import { BlogPost } from "../../data/Blog";
import BlogCard from "./BlogCard";
import { ArrowLeftIcon } from "../NavgrahBracelets/Icons";

export interface BlogSectionProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  onViewAll?: () => void;
  limit?: number;
}

function ViewAllButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border border-[#d9c7a5] px-4 py-2 text-sm font-medium text-[#8c6327] transition-colors hover:bg-[#8c6327] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47735] ${className}`}
    >
      View all articles
      <ArrowLeftIcon className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </button>
  );
}

export default function BlogSection({ posts, onOpenPost, onViewAll, limit = 3 }: BlogSectionProps) {
  if (!Array.isArray(posts) || posts.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[BlogSection] No posts received.", posts);
    }
    return null;
  }

  const shown = posts.slice(0, limit);
  const [lead, ...rest] = shown;

  return (
    <section aria-labelledby="journal-heading" className="mt-14 sm:mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2
              id="journal-heading"
              className="font-serif text-3xl font-semibold leading-tight text-[#241c16] sm:text-4xl"
            >
              From the Journal
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d6259] sm:text-base">
              Guides on rashis, gemstones and bracelet care, written to help you choose with confidence.
            </p>
          </div>
          {onViewAll && <ViewAllButton onClick={onViewAll} className="hidden self-start sm:inline-flex sm:self-auto" />}
        </div>

        <div
          className={`${styles.scrollbarHide} -mx-4 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:hidden`}
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} onOpen={onOpenPost} variant="compact" />
          ))}
        </div>

        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:hidden">
          <div className="sm:col-span-2">
            <BlogCard post={lead} onOpen={onOpenPost} variant="featured" />
          </div>
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} onOpen={onOpenPost} variant="grid" />
          ))}
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BlogCard post={lead} onOpen={onOpenPost} variant="featured" />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-2">
            {rest.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} onOpen={onOpenPost} variant="row" className="flex-1" />
            ))}
          </div>
        </div>

        {onViewAll && (
          <div className="mt-5 sm:hidden">
            <ViewAllButton onClick={onViewAll} className="w-full justify-center" />
          </div>
        )}
      </div>
    </section>
  );
}