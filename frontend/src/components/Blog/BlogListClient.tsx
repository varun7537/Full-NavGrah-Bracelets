"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "../../data/Blog";
import BlogCard from "./BlogCard";
import { ArrowLeftIcon } from "../NavgrahBracelets/Icons";

const ALL = "All";
const PAGE_SIZE = 9;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47735]";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const open = (post: BlogPost) => router.push(`/blog/${post.slug}`);
  const goHome = () => router.push("/");

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [posts]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    sortedPosts.forEach((p) =>
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    );
    return counts;
  }, [sortedPosts]);

  const categories = useMemo(
    () => [ALL, ...Array.from(categoryCounts.keys()).sort()],
    [categoryCounts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedPosts.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [sortedPosts, category, query]);

  const isDefaultView = category === ALL && !query.trim();
  const lead = isDefaultView ? filtered[0] : undefined;
  const rest = isDefaultView ? filtered.slice(1) : filtered;
  const visibleRest = rest.slice(0, visibleCount);
  const hasMore = rest.length > visibleCount;

  const handleCategory = (c: string) => {
    setCategory(c);
    setVisibleCount(PAGE_SIZE);
  };

  const handleQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setCategory(ALL);
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-8">
      <button
        type="button"
        onClick={goHome}
        className={`mb-7 inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#6d6259] transition-colors duration-200 hover:text-[#241c16] ${focusRing}`}
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to Home
      </button>

      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-xs text-[#8a7f72]">
          <li>
            <button
              type="button"
              onClick={goHome}
              className={`rounded transition-colors hover:text-[#8c6327] ${focusRing}`}
            >
              Home
            </button>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[#241c16]">
            Journal
          </li>
        </ol>
      </nav>

      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-[#241c16] sm:text-5xl">
          The Journal
        </h1>
        <p className="mt-3 text-base leading-7 text-[#6d6259] sm:text-lg">
          Guides on rashis, gemstones and bracelet care, written to help you
          choose with confidence.
        </p>
        {sortedPosts.length > 0 && (
          <p className="mt-3 text-sm text-[#8a7f72]">
            {sortedPosts.length} article{sortedPosts.length === 1 ? "" : "s"}{" "}
            · {categoryCounts.size} categor
            {categoryCounts.size === 1 ? "y" : "ies"}
          </p>
        )}
      </header>

      {sortedPosts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#d9c7a5] bg-[#faf6f0] px-6 py-14 text-center">
          <p className="font-serif text-xl font-semibold text-[#241c16]">
            No articles published yet
          </p>
          <p className="mt-2 text-sm text-[#6d6259]">
            Please check back soon for new guides.
          </p>
          <button
            type="button"
            onClick={goHome}
            className={`mt-5 rounded-full border border-[#8c6327] px-5 py-2 text-sm font-medium text-[#8c6327] transition-colors hover:bg-[#8c6327] hover:text-white ${focusRing}`}
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              {categories.map((c) => {
                const active = c === category;
                const count =
                  c === ALL ? sortedPosts.length : categoryCounts.get(c) ?? 0;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCategory(c)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      active
                        ? "border-[#8c6327] bg-[#8c6327] text-white"
                        : "border-[#e7dfd5] bg-white text-[#6d6259] hover:border-[#a47735] hover:text-[#8c6327]"
                    }`}
                  >
                    {c}
                    <span
                      className={`ml-1.5 text-xs ${
                        active ? "text-white/80" : "text-[#a89d8f]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89d8f]" />
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                placeholder="Search articles"
                className={`w-full rounded-full border border-[#e7dfd5] bg-white py-2.5 pl-10 pr-10 text-sm text-[#241c16] placeholder:text-[#a89d8f] [&::-webkit-search-cancel-button]:appearance-none ${focusRing}`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQuery("")}
                  aria-label="Clear search"
                  className={`absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#8a7f72] transition-colors hover:bg-[#f5eee5] hover:text-[#241c16] ${focusRing}`}
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 sm:mt-10" aria-live="polite">
            {!isDefaultView && filtered.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#8a7f72]">
                  {filtered.length} article{filtered.length === 1 ? "" : "s"}{" "}
                  found
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`rounded text-sm font-medium text-[#8c6327] underline-offset-4 hover:underline ${focusRing}`}
                >
                  Clear filters
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d9c7a5] bg-[#faf6f0] px-6 py-14 text-center">
                <p className="font-serif text-xl font-semibold text-[#241c16]">
                  No articles found
                </p>
                <p className="mt-2 text-sm text-[#6d6259]">
                  Try a different search or choose another category.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-5 rounded-full border border-[#8c6327] px-5 py-2 text-sm font-medium text-[#8c6327] transition-colors hover:bg-[#8c6327] hover:text-white ${focusRing}`}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {lead && (
                  <BlogCard post={lead} onOpen={open} variant="featured" />
                )}

                {visibleRest.length > 0 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleRest.map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        onOpen={open}
                        variant="grid"
                      />
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="flex flex-col items-center gap-2 pt-4">
                    <p className="text-xs text-[#8a7f72]">
                      Showing {visibleRest.length + (lead ? 1 : 0)} of{" "}
                      {filtered.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                      className={`rounded-full border border-[#8c6327] px-6 py-2.5 text-sm font-medium text-[#8c6327] transition-colors hover:bg-[#8c6327] hover:text-white ${focusRing}`}
                    >
                      Load more articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}