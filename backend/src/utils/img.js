/** Sanity CDN image ko resize + WebP/AVIF karta hai. Doosre URLs jaise hain waise. */
export function img(url, width, quality = 75) {
  if (!url || !String(url).includes("cdn.sanity.io")) return url || "";
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.set("q", String(quality));
    u.searchParams.set("fit", "max");
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    return url;
  }
}