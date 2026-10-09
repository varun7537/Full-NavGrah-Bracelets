import type { BlogPost } from "../data/Blog";

// const API =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "http://localhost:5000/api";
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://navgrah-bracelets-api.vercel.app";

export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pages: number;
}

export async function fetchPosts(
  opts: {
    limit?: number;
    page?: number;
    category?: string;
  } = {}
): Promise<PostsResponse> {
  const qs = new URLSearchParams();

  if (opts.limit !== undefined) {
    qs.set("limit", String(opts.limit));
  }

  if (opts.page !== undefined) {
    qs.set("page", String(opts.page));
  }

  if (opts.category) {
    qs.set("category", opts.category);
  }

  const query = qs.toString();

  const response = await fetch(
    `${API}/blog${query ? `?${query}` : ""}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Blog API failed: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    posts: Array.isArray(data.posts)
      ? data.posts
      : [],
    total: Number(data.total ?? 0),
    page: Number(data.page ?? 1),
    pages: Number(data.pages ?? 0),
  };
}

export async function fetchPost(
  slug: string
): Promise<BlogPost | null> {
  const response = await fetch(
    `${API}/blog/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Blog API failed: ${response.status}`
    );
  }

  return response.json();
}

export async function fetchRelatedPosts(
  slug: string,
  limit = 3
): Promise<BlogPost[]> {
  const response = await fetch(
    `${API}/blog/${encodeURIComponent(slug)}/related?limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return Array.isArray(data.posts)
    ? data.posts
    : [];
}

export function trackView(slug: string): void {
  fetch(
    `${API}/blog/${encodeURIComponent(slug)}/view`,
    {
      method: "POST",
      keepalive: true,
    }
  ).catch(() => {});
}
