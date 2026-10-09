"use client";

import styles from "../../styles/Braceletscollection.module.css";
import { BlogPost } from "../../data/Blog";
import { CalendarIcon, ClockIcon } from "../NavgrahBracelets/Icons";
import { formatDate } from "../../lib/blogUtils";

export type BlogCardVariant = "grid" | "compact" | "featured" | "row";

export interface BlogCardProps {
  post: BlogPost;
  onOpen: (post: BlogPost) => void;
  variant?: BlogCardVariant;
  className?: string;
}

function Cover({ post, className }: { post: BlogPost; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#f5eee5] ${className}`}>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f5eee5] to-[#e7d7ba] font-serif text-3xl text-[#a47735]">
          ✦
        </div>
      )}
    </div>
  );
}

function Category({ children, floating = false }: { children: React.ReactNode; floating?: boolean }) {
  return (
    <span
      className={
        floating
          ? "absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#8c6327] shadow-sm backdrop-blur-sm"
          : "text-xs font-semibold text-[#8c6327]"
      }
    >
      {children}
    </span>
  );
}

function Meta({ post, className = "" }: { post: BlogPost; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a7f72] ${className}`}>
      <span className="flex items-center gap-1.5">
        <CalendarIcon className="h-3.5 w-3.5" />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </span>
      <span className="flex items-center gap-1.5">
        <ClockIcon className="h-3.5 w-3.5" />
        {post.readTimeMinutes} min read
      </span>
    </div>
  );
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47735]";

export default function BlogCard({ post, onOpen, variant = "grid", className = "" }: BlogCardProps) {
  const open = () => onOpen(post);
  const label = `Read: ${post.title}`;

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={label}
        className={`${styles.fadeIn} group flex w-full items-stretch gap-4 rounded-2xl border border-[#e7dfd5] bg-white p-3 text-left transition-colors hover:border-[#d9c7a5] ${focusRing} ${className}`}
      >
        <Cover post={post} className="aspect-square w-28 shrink-0 rounded-xl sm:w-32" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-1">
          <Category>{post.category}</Category>
          <h3
            className={`${styles.lineClamp2} font-serif text-base font-semibold leading-snug text-[#241c16] transition-colors group-hover:text-[#8c6327]`}
          >
            {post.title}
          </h3>
          <Meta post={post} className="mt-1" />
        </div>
      </button>
    );
  }

  if (variant === "featured") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={label}
        className={`${styles.fadeIn} group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#e7dfd5] bg-white text-left transition-colors hover:border-[#d9c7a5] ${focusRing} ${className}`}
      >
        <div className="relative">
          <Cover post={post} className="aspect-[16/10] w-full lg:aspect-[16/9]" />
          <Category floating>{post.category}</Category>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-7">
          <h3
            className={`${styles.lineClamp2} font-serif text-2xl font-semibold leading-tight text-[#241c16] transition-colors group-hover:text-[#8c6327] sm:text-3xl`}
          >
            {post.title}
          </h3>
          <p className="line-clamp-3 max-w-prose text-[15px] leading-7 text-[#6d6259]">{post.excerpt}</p>
          <Meta post={post} className="mt-auto border-t border-[#efe8dc] pt-4" />
        </div>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={label}
        className={`${styles.fadeIn} group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white text-left sm:w-[320px] ${focusRing} ${className}`}
      >
        <div className="relative">
          <Cover post={post} className="aspect-[4/3] w-full" />
          <Category floating>{post.category}</Category>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className={`${styles.lineClamp2} font-serif text-base font-semibold leading-snug text-[#241c16]`}>
            {post.title}
          </h3>
          <Meta post={post} className="mt-auto" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={label}
      className={`${styles.fadeIn} group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white text-left transition-colors hover:border-[#d9c7a5] ${focusRing} ${className}`}
    >
      <div className="relative">
        <Cover post={post} className="aspect-[16/10] w-full" />
        <Category floating>{post.category}</Category>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3
          className={`${styles.lineClamp2} font-serif text-lg font-semibold leading-snug text-[#241c16] transition-colors group-hover:text-[#8c6327] sm:text-xl`}
        >
          {post.title}
        </h3>
        <p className={`${styles.lineClamp2} text-sm leading-6 text-[#6d6259]`}>{post.excerpt}</p>
        <Meta post={post} className="mt-auto border-t border-[#efe8dc] pt-3" />
      </div>
    </button>
  );
}