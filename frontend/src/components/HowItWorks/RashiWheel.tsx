"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { ELEMENT_COLORS, RASHIS } from "../../data/rashis";
import { ZodiacGlyphContent } from "./ZodiacIcons";

const CENTER = 150;
const WEDGE_INNER = 46;
const WEDGE_OUTER = 118;
const GLYPH_RADIUS = 94;
const GLYPH_SIZE = 20;
const TICK_INNER = 128;
const TICK_OUTER = 138;
const LABEL_RADIUS = 132;

/**
 * Round SVG geometry to a fixed precision.
 *
 * Math.sin/cos can produce tiny floating-point differences between
 * server and client, e.g.
 * 47.809002353436256 vs 47.80900235343627.
 *
 * Those values render identically but cause React hydration mismatches.
 * Rounding the geometry makes the generated SVG deterministic.
 */
function roundSvgNumber(value: number, precision = 4) {
  const factor = 10 ** precision;
  const rounded = Math.round(value * factor) / factor;

  // Avoid serialising "-0".
  return Object.is(rounded, -0) ? 0 : rounded;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: roundSvgNumber(cx + r * Math.cos(rad)),
    y: roundSvgNumber(cy + r * Math.sin(rad)),
  };
}

function wedgePath(startDeg: number, endDeg: number) {
  const outerStart = polarToCartesian(
    CENTER,
    CENTER,
    WEDGE_OUTER,
    endDeg,
  );
  const outerEnd = polarToCartesian(
    CENTER,
    CENTER,
    WEDGE_OUTER,
    startDeg,
  );
  const innerStart = polarToCartesian(
    CENTER,
    CENTER,
    WEDGE_INNER,
    startDeg,
  );
  const innerEnd = polarToCartesian(
    CENTER,
    CENTER,
    WEDGE_INNER,
    endDeg,
  );

  const largeArc = endDeg - startDeg <= 180 ? "0" : "1";

  return [
    "M",
    outerStart.x,
    outerStart.y,
    "A",
    WEDGE_OUTER,
    WEDGE_OUTER,
    0,
    largeArc,
    0,
    outerEnd.x,
    outerEnd.y,
    "L",
    innerStart.x,
    innerStart.y,
    "A",
    WEDGE_INNER,
    WEDGE_INNER,
    0,
    largeArc,
    1,
    innerEnd.x,
    innerEnd.y,
    "Z",
  ].join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const ORBIT_TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = i * 15;

  const inner = polarToCartesian(
    CENTER,
    CENTER,
    TICK_INNER,
    angle,
  );

  const outer = polarToCartesian(
    CENTER,
    CENTER,
    TICK_OUTER,
    angle,
  );

  return {
    x1: inner.x,
    y1: inner.y,
    x2: outer.x,
    y2: outer.y,
  };
});

const easeOut = [0.22, 1, 0.36, 1] as const;

const wedgeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },

  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: 0.15 + i * 0.045,
      ease: easeOut,
    },
  }),
};

interface RashiWheelProps {
  inView: boolean;
  className?: string;
}

export default function RashiWheel({
  inView,
  className = "",
}: RashiWheelProps) {
  const shouldReduceMotion = useReducedMotion();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredIndex = RASHIS.findIndex(
    (rashi) => rashi.id === hoveredId,
  );

  const hovered =
    hoveredIndex >= 0 ? RASHIS[hoveredIndex] : null;

  const labelPoint =
    hovered && hoveredIndex >= 0
      ? polarToCartesian(
          CENTER,
          CENTER,
          LABEL_RADIUS,
          hoveredIndex * 30 + 15,
        )
      : null;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 300 300"
        className="h-auto w-full"
        role="img"
        aria-label="Interactive illustration of a rashi wheel showing the twelve zodiac signs"
      >
        <defs>
          <radialGradient
            id="navgrah-wheel-glow"
            cx="50%"
            cy="50%"
            r="60%"
          >
            <stop
              offset="0%"
              stopColor="#B4791E"
              stopOpacity="0.14"
            />
            <stop
              offset="100%"
              stopColor="#B4791E"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r="150"
          fill="url(#navgrah-wheel-glow)"
        />

        {/* Slow, ambient tick ring */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  rotate: 360,
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 160,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={TICK_OUTER}
            fill="none"
            stroke="#B4791E"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {ORBIT_TICKS.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#B4791E"
              strokeOpacity={i % 2 === 0 ? 0.35 : 0.15}
              strokeWidth="1"
            />
          ))}
        </motion.g>

        {/* Divider lines */}
        {RASHIS.map((rashi, i) => {
          const angle = i * 30;

          const outer = polarToCartesian(
            CENTER,
            CENTER,
            WEDGE_OUTER,
            angle,
          );

          const inner = polarToCartesian(
            CENTER,
            CENTER,
            WEDGE_INNER,
            angle,
          );

          return (
            <motion.line
              key={`divider-${rashi.id}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#201A2E"
              strokeOpacity="0.18"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: inView ? 1 : 0,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Twelve rashi wedges */}
        {RASHIS.map((rashi, i) => {
          const startDeg = i * 30;
          const endDeg = startDeg + 30;
          const midDeg = startDeg + 15;

          const glyphPoint = polarToCartesian(
            CENTER,
            CENTER,
            GLYPH_RADIUS,
            midDeg,
          );

          const color = ELEMENT_COLORS[rashi.element];
          const isHovered = hoveredId === rashi.id;
          const path = wedgePath(startDeg, endDeg);

          return (
            <motion.g
              key={rashi.id}
              custom={i}
              variants={wedgeVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              onHoverStart={() => setHoveredId(rashi.id)}
              onHoverEnd={() =>
                setHoveredId((id) =>
                  id === rashi.id ? null : id,
                )
              }
              onFocus={() => setHoveredId(rashi.id)}
              onBlur={() =>
                setHoveredId((id) =>
                  id === rashi.id ? null : id,
                )
              }
              tabIndex={0}
              role="button"
              aria-label={`${rashi.sanskrit}, ${rashi.english}, a ${rashi.element} sign — signature stone ${rashi.gemstone}`}
              style={{
                cursor: "pointer",
                outline: "none",
              }}
            >
              <motion.path
                d={path}
                fill={color}
                animate={{
                  fillOpacity: isHovered ? 0.16 : 0.07,
                }}
                transition={{
                  duration: 0.2,
                }}
              />

              <path
                d={path}
                fill="none"
                stroke={color}
                strokeOpacity="0.18"
                strokeWidth="1"
              />

              <motion.g
                style={{
                  transformOrigin: `${glyphPoint.x}px ${glyphPoint.y}px`,
                }}
                animate={{
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 18,
                }}
              >
                <circle
                  cx={glyphPoint.x}
                  cy={glyphPoint.y}
                  r="14"
                  fill="#FFFFFF"
                  stroke={color}
                  strokeWidth={isHovered ? 2.25 : 1.5}
                />

                <svg
                  x={glyphPoint.x - GLYPH_SIZE / 2}
                  y={glyphPoint.y - GLYPH_SIZE / 2}
                  width={GLYPH_SIZE}
                  height={GLYPH_SIZE}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <ZodiacGlyphContent id={rashi.id} />
                </svg>
              </motion.g>
            </motion.g>
          );
        })}

        {/* Centre medallion */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={WEDGE_INNER - 4}
          fill="#FFFFFF"
          stroke="#B4791E"
          strokeOpacity="0.3"
          strokeWidth="1"
        />

        <text
          x={CENTER}
          y={CENTER - 3}
          textAnchor="middle"
          fontSize="11"
          fill="#201A2E"
          fillOpacity="0.7"
        >
          राशि
        </text>

        <text
          x={CENTER}
          y={CENTER + 12}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.5"
          fill="#201A2E"
          fillOpacity="0.45"
        >
          chakra
        </text>
      </svg>

      <AnimatePresence>
        {hovered && labelPoint && (
          <motion.div
            key={hovered.id}
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 4,
            }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className="pointer-events-none absolute z-10 w-max max-w-[10rem] -translate-x-1/2 -translate-y-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-center shadow-lg"
            style={{
              left: `${clamp(
                (labelPoint.x / 300) * 100,
                14,
                86,
              )}%`,
              top: `${clamp(
                (labelPoint.y / 300) * 100,
                8,
                92,
              )}%`,
            }}
          >
            <p className="text-xs font-semibold text-ink">
              {hovered.sanskrit}
            </p>

            <p className="text-[10px] text-ink/60">
              {hovered.english} · {hovered.gemstone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
