// src/components/RashiBracelets/utils.ts

/** Converts a #rrggbb / #rgb hex color into an rgba() string at the given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const int = parseInt(full, 16);

  if (Number.isNaN(int)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Position of item `index` of `total` around a clock-like circle,
 * expressed as a percentage offset from the center. Item 0 starts at
 * 12 o'clock and items proceed clockwise.
 */
export function wheelPosition(
  index: number,
  total: number,
  radiusPct: number
): { x: number; y: number } {
  const angle = (index / total) * 2 * Math.PI;

  const x = 50 + radiusPct * Math.sin(angle);
  const y = 50 - radiusPct * Math.cos(angle);

  return { x, y };
}