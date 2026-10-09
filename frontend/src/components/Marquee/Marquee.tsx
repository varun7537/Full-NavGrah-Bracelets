// src/components/NavgrahBracelets/Marquee.tsx

const DEFAULT_ITEMS = [
  "Personalized for You",
  "Based on Your Birth Chart",
  "Authentic Gemstones",
  "Handcrafted Bracelets",
  "Navgrah Astrology",
  "Made With Intention",
  "Personalized Gemstone Selection",
  "Spiritual Wellness",
];

interface MarqueeProps {
  items?: string[];
  separator?: string;
  className?: string;
}

export default function Marquee({
  items = DEFAULT_ITEMS,
  separator = "\u2726",
  className = "",
}: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      role="region"
      aria-label={`Brand highlights: ${items.join(", ")}`}
      className={`relative w-full overflow-hidden border-y border-[#B8874B]/25 bg-[#0E1730] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(180deg, #101A34 0%, #0B1226 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0E1730] to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0E1730] to-transparent sm:w-20"
      />

      <div
        aria-hidden="true"
        className="flex h-14 w-max flex-nowrap items-center gap-x-8 whitespace-nowrap py-0
          [animation:navgrah-marquee_22s_linear_infinite]
          sm:h-16 sm:gap-x-12 sm:[animation-duration:26s]
          lg:gap-x-16 lg:[animation-duration:32s]
          [@media(hover:hover)]:hover:[animation-play-state:paused]
          motion-reduce:!animate-none motion-reduce:!transform-none"
      >
        {track.map((phrase, index) => (
          <div
            key={`${phrase}-${index}`}
            className={`flex items-center gap-x-8 sm:gap-x-12 lg:gap-x-16 ${
              index >= items.length ? "motion-reduce:hidden" : ""
            }`}
          >
            <span className="font-display text-sm font-medium tracking-[0.01em] text-[#E9CE9C] sm:text-base lg:text-lg">
              {phrase}
            </span>
            <span
              aria-hidden="true"
              className="select-none text-xs text-[#D9B876]/70 sm:text-sm"
              style={{ textShadow: "0 0 6px rgba(217,184,118,0.55)" }}
            >
              {separator}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes navgrah-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}