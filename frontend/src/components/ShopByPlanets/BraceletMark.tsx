import { useState } from "react";
import clsx from "clsx";

export interface BraceletMarkProps {
  accent: string;
  beadTone: string;
  metalTone: string;
  label: string;
  image?: string;
  imageAlt?: string;
  className?: string;
}

const BEAD_COUNT = 16;
const RADIUS = 92;
const CENTER = 120;

export function BraceletMark({
  accent,
  beadTone,
  metalTone,
  label,
  image,
  imageAlt,
  className,
}: BraceletMarkProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt={imageAlt ?? label}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={clsx("h-full w-full object-contain", className)}
      />
    );
  }

  const beads = Array.from({ length: BEAD_COUNT }, (_, i) => {
    const angle = (i / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2;
    const x = CENTER + RADIUS * Math.cos(angle);
    const y = CENTER + RADIUS * Math.sin(angle);
    const position = i % 4;
    const isGem = position === 0;
    const isMetal = position === 2;

    const fill = isGem ? beadTone : isMetal ? metalTone : "#F4F0E9";
    const radius = isGem ? 9 : isMetal ? 7.5 : 6.5;
    const stroke = isGem || isMetal ? "none" : "#DCD5C7";

    return (
      <g key={i}>
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          className="transition-[fill,stroke] duration-500 ease-out"
        />
        {isGem && (
          <circle
            cx={x - radius * 0.32}
            cy={y - radius * 0.32}
            r={radius * 0.3}
            fill="#FFFFFF"
            opacity={0.35}
          />
        )}
      </g>
    );
  });

  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
      className={clsx("h-full w-full", className)}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={accent}
        strokeOpacity={0.18}
        strokeWidth={1}
      />
      {beads}
    </svg>
  );
}