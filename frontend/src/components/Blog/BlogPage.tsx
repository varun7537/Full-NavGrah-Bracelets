"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BlogPost } from "../../data/Blog";
// Rashi Bracelets integration is intentionally disabled.
// Keep the underlying data/component files intact so this feature
// can be restored later.
// import { rashiById } from "../../data/Rashibracelets";
import { trackView } from "../../lib/blogApi";
import { formatDate, initials } from "../../lib/blogUtils";
import BlogCard from "./BlogCard";
// Rashi Bracelets integration is intentionally disabled.
// import RashiAvatar from "../Collections/RashiAvatar";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  TagIcon,
} from "../NavgrahBracelets/Icons";

export interface BlogPageProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  onBack: () => void;
  onOpenPost: (post: BlogPost) => void;
  onShopRashi?: (rashiId: string) => void;
  shareUrl?: string;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47735]";

function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1e4cb] text-xs font-semibold text-[#8c6327]"
      style={{ width: size, height: size }}
      aria-hidden={src ? true : undefined}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function BlogSectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto my-10 h-px w-16 bg-[#d8c5a7] sm:my-14"
    />
  );
}

export default function BlogPage({
  post,
  relatedPosts = [],
  onBack,
  onOpenPost,
  shareUrl,
}: BlogPageProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);
  const headings = useMemo(
    () =>
      post.content
        .map((block, index) =>
          block.type === "heading"
            ? {
                id: `section-${index}`,
                text: block.text,
              }
            : null
        )
        .filter(
          (heading): heading is { id: string; text: string } =>
            heading !== null
        ),
    [post.content]
  );

  const showToc = headings.length >= 3;

  const firstParagraph = post.content.findIndex(
    (block) => block.type === "paragraph"
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [post.id]);

  useEffect(() => {
    let cancelled = false;

    const recordView = async () => {
      try {
        await trackView(post.slug);
      } catch {
        if (!cancelled) {
        }
      }
    };

    void recordView();

    return () => {
      cancelled = true;
    };
  }, [post.slug]);

  useEffect(() => {
    const updateProgress = () => {
      const element = articleRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const total = rect.height - window.innerHeight;

      if (total <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const nextProgress = Math.round((scrolled / total) * 100);

      setProgress(nextProgress);
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [post.id]);
  useEffect(() => {
    if (!showToc) {
      return;
    }

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0, 0.1, 0.5],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings, showToc]);

  const handleShare = async () => {
    const url =
      shareUrl ??
      (typeof window !== "undefined" ? window.location.href : "");

    if (!url) {
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url,
        });

        return;
      } catch {
      }
    }

    try {
      if (
        typeof navigator === "undefined" ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== "function"
      ) {
        return;
      }

      await navigator.clipboard.writeText(url);

      setShareState("copied");

      window.setTimeout(() => {
        setShareState("idle");
      }, 1800);
    } catch {
    }
  };

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <style jsx>{`
        @keyframes blogFadeUp {
          from {
            opacity: 0;
            transform: translate3d(0, 12px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes blogFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .blog-reveal {
          animation: blogFadeUp 500ms ease-out both;
        }

        .blog-fade {
          animation: blogFadeIn 600ms ease-out both;
        }

        .blog-delay-1 {
          animation-delay: 70ms;
        }

        .blog-delay-2 {
          animation-delay: 140ms;
        }

        .blog-delay-3 {
          animation-delay: 210ms;
        }

        .blog-delay-4 {
          animation-delay: 280ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .blog-reveal,
          .blog-fade {
            animation: none;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div
          className="sticky top-0 z-30 h-1 w-full bg-[#efe8dc]"
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-[#a47735] transition-[width] duration-150 ease-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main>
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pb-20 sm:pt-8 lg:pb-24">
            <button
              type="button"
              onClick={onBack}
              className={`blog-reveal mb-7 inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#6d6259] transition-colors duration-200 hover:text-[#241c16] ${focusRing}`}
            >
              <ArrowLeftIcon
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
              Back to Journal
            </button>

            <header className="mx-auto max-w-3xl">
              <div className="blog-reveal">
                <span className="inline-flex items-center rounded-full bg-[#faf3e7] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#8c6327]">
                  {post.category}
                </span>
              </div>

              <h1 className="blog-reveal blog-delay-1 mt-4 max-w-3xl font-serif text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-[#241c16] sm:text-4xl lg:text-[2.9rem]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="blog-reveal blog-delay-2 mt-5 max-w-2xl text-base leading-7 text-[#6d6259] sm:text-lg sm:leading-8">
                  {post.excerpt}
                </p>
              )}

              <div className="blog-reveal blog-delay-3 mt-7 border-y border-[#efe8dc] py-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-4 text-sm text-[#6d6259]">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      name={post.author.name}
                      src={post.author.avatar}
                    />

                    <span className="min-w-0 leading-tight">
                      <span className="block truncate font-medium text-[#241c16]">
                        {post.author.name}
                      </span>

                      {post.author.role && (
                        <span className="mt-0.5 block truncate text-xs text-[#8a7f72]">
                          {post.author.role}
                        </span>
                      )}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden h-4 w-px bg-[#e7dfd5] sm:block"
                  />

                  <span className="flex items-center gap-1.5">
                    <CalendarIcon
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />

                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt, true)}
                    </time>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <ClockIcon
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />

                    {post.readTimeMinutes} min read
                  </span>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={
                      shareState === "copied"
                        ? "Article link copied"
                        : "Share this article"
                    }
                    className={`ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#e7dfd5] bg-white px-4 py-2 font-medium text-[#241c16] shadow-sm transition-all duration-200 hover:border-[#a47735] hover:bg-[#faf3e7] hover:text-[#8c6327] hover:shadow-md active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${focusRing}`}
                  >
                    <ShareIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    <span aria-live="polite">
                      {shareState === "copied" ? "Link copied" : "Share"}
                    </span>
                  </button>
                </div>
              </div>
            </header>

            {post.coverImage && (
              <figure className="blog-fade blog-delay-4 mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl bg-[#f5eee5] shadow-[0_12px_45px_rgba(66,45,24,0.08)] sm:mt-10 sm:rounded-3xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.015] motion-reduce:transition-none motion-reduce:hover:scale-100"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {post.coverImageAlt && (
                  <figcaption className="sr-only">
                    {post.coverImageAlt}
                  </figcaption>
                )}
              </figure>
            )}

            {!post.coverImage && <BlogSectionDivider />}

            <div
              className={`mt-10 sm:mt-14 ${
                showToc
                  ? "lg:grid lg:grid-cols-[190px_minmax(0,42rem)] lg:justify-center lg:gap-14 xl:grid-cols-[210px_minmax(0,42rem)] xl:gap-16"
                  : ""
              }`}
            >
              {showToc && (
                <aside className="hidden lg:block">
                  <nav
                    aria-label="In this article"
                    className="sticky top-20"
                  >
                    <p className="mb-3 text-sm font-semibold text-[#241c16]">
                      In this article
                    </p>

                    <ul className="space-y-1 border-l border-[#e7dfd5]">
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <button
                            type="button"
                            onClick={() => goToSection(heading.id)}
                            aria-current={
                              activeId === heading.id ? "location" : undefined
                            }
                            className={`-ml-px block w-full border-l-2 py-1.5 pl-3 text-left text-sm leading-snug transition-colors duration-200 motion-reduce:transition-none ${focusRing} ${
                              activeId === heading.id
                                ? "border-[#a47735] font-medium text-[#8c6327]"
                                : "border-transparent text-[#6d6259] hover:text-[#241c16]"
                            }`}
                          >
                            {heading.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </aside>
              )}

              <article
                ref={articleRef}
                className={`min-w-0 ${
                  showToc ? "" : "mx-auto max-w-[42rem]"
                }`}
              >
                <div className="space-y-6">
                  {post.content.map((block, index) => {
                    if (block.type === "heading") {
                      return (
                        <h2
                          key={`heading-${index}`}
                          id={`section-${index}`}
                          className="scroll-mt-24 pt-5 font-serif text-xl font-semibold leading-snug tracking-[-0.01em] text-[#241c16] sm:pt-7 sm:text-2xl"
                        >
                          {block.text}
                        </h2>
                      );
                    }

                    if (block.type === "quote") {
                      return (
                        <blockquote
                          key={`quote-${index}`}
                          className="my-8 rounded-r-2xl border-l-4 border-[#a47735] bg-[#faf3e7] px-5 py-5 font-serif text-lg italic leading-8 text-[#403a34] shadow-[0_4px_20px_rgba(102,73,36,0.04)] sm:px-6 sm:py-6 sm:text-xl"
                        >
                          {block.text}
                        </blockquote>
                      );
                    }

                    const isLead = index === firstParagraph;

                    return (
                      <p
                        key={`paragraph-${index}`}
                        className={
                          isLead
                            ? "text-lg leading-8 text-[#241c16] sm:text-xl sm:leading-9"
                            : "text-base leading-8 text-[#403a34] sm:text-[17px] sm:leading-[1.9]"
                        }
                      >
                        {block.text}
                      </p>
                    );
                  })}
                </div>

                {post.tags.length > 0 && (
                  <div className="mt-10 border-t border-[#efe8dc] pt-6 sm:mt-12">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#f5eee5] px-3 py-1.5 text-xs font-medium text-[#6d6259] transition-colors duration-200 hover:bg-[#faf3e7] hover:text-[#8c6327] motion-reduce:transition-none"
                        >
                          <TagIcon
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <section
                  aria-label="Article author"
                  className="mt-8 flex items-center gap-4 rounded-2xl border border-[#e7dfd5] bg-white p-4 shadow-[0_5px_25px_rgba(61,42,23,0.04)] transition-shadow duration-300 hover:shadow-[0_10px_35px_rgba(61,42,23,0.07)] sm:p-5 motion-reduce:transition-none"
                >
                  <Avatar
                    name={post.author.name}
                    src={post.author.avatar}
                    size={48}
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-[#8a7f72]">
                      Written by
                    </p>

                    <p className="truncate font-medium text-[#241c16]">
                      {post.author.name}
                    </p>

                    {post.author.role && (
                      <p className="truncate text-sm text-[#6d6259]">
                        {post.author.role}
                      </p>
                    )}
                  </div>
                </section>
              </article>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="border-t border-[#efe8dc] bg-[#faf6f0] px-4 py-12 sm:px-6 sm:py-16"
            >
              <div className="mx-auto max-w-6xl">
                <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#a47735]">
                      From the journal
                    </p>

                    <h2
                      id="related-heading"
                      className="font-serif text-2xl font-semibold tracking-[-0.01em] text-[#241c16] sm:text-3xl"
                    >
                      Keep reading
                    </h2>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related, index) => (
                    <div
                      key={related.id}
                      className={`blog-reveal ${
                        index === 0
                          ? "blog-delay-1"
                          : index === 1
                            ? "blog-delay-2"
                            : index === 2
                              ? "blog-delay-3"
                              : "blog-delay-4"
                      }`}
                    >
                      <BlogCard
                        post={related}
                        onOpen={onOpenPost}
                        variant="grid"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}