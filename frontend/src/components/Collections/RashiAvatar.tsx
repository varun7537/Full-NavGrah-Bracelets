"use client";

import { useState } from "react";
import Image from "next/image";
import { Rashi } from "../../data/Rashibracelets";

export interface RashiAvatarProps {
  rashi: Rashi;
  size?: number | "fill";
  ring?: boolean;
  className?: string;
}

export default function RashiAvatar({
  rashi,
  size = 32,
  ring = true,
  className = "",
}: RashiAvatarProps) {
  const [failed, setFailed] = useState(false);

  const isFill = size === "fill";

  /**
   * Normalize image paths for Next.js.
   *
   * Examples:
   * "../public/images/aries_image.jpg"
   * "./public/images/aries_image.jpg"
   * "public/images/aries_image.jpg"
   *
   * become:
   * "/images/aries_image.jpg"
   */
  const normalizeImagePath = (imagePath: string | undefined | null) => {
    if (!imagePath) return null;

    const path = imagePath.trim();

    if (!path) return null;

    // Already an absolute external URL
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    // Remove leading "./"
    let normalized = path.replace(/^(\.\/)+/, "");

    // Remove "../" segments
    normalized = normalized.replace(/^(\.\.\/)+/, "");

    // Remove "public/" because public is the web root in Next.js
    normalized = normalized.replace(/^public\//i, "");

    // Ensure it starts with "/"
    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    return normalized;
  };

  const imageSrc = normalizeImagePath(rashi.image);

  /**
   * If image doesn't exist / can't load,
   * show zodiac glyph instead.
   */
  const glyph = rashi.symbol ?? rashi.name?.charAt(0) ?? "?";

  const glyphSize = isFill
    ? 56
    : Math.max(10, Math.round(Number(size) * 0.6));

  const shapeClasses = isFill
    ? "absolute inset-0 h-full w-full"
    : `relative inline-flex shrink-0 rounded-full ${
        ring ? "ring-1 ring-white" : ""
      }`;

  return (
    <span
      className={`${shapeClasses} overflow-hidden bg-[#f5eee5] ${className}`}
      style={isFill ? undefined : { width: size, height: size }}
    >
      {!imageSrc || failed ? (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f5eee5] to-[#e7d7ba] leading-none text-[#a47735]"
          style={{ fontSize: glyphSize }}
        >
          {glyph}
        </span>
      ) : (
        <Image
          src={imageSrc}
          alt={rashi.name || "Rashi"}
          fill
          sizes={
            isFill
              ? "(max-width: 640px) 100vw, 400px"
              : `${Number(size)}px`
          }
          onError={() => setFailed(true)}
          className="object-cover"
          unoptimized={imageSrc.startsWith("http")}
        />
      )}
    </span>
  );
}
