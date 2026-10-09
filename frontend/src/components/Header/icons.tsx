import type { ReactNode, SVGProps } from "react";

export type IconProps = {
  /** Tailwind/CSS classes — the primary way to size and color an icon. */
  className?: string;

  /** Optional explicit pixel size; omit and size via `className` instead. */
  size?: number;

  /** Defaults to true — icons are decorative unless told otherwise. */
  "aria-hidden"?: boolean;
};

const ICON_STROKE = 1.6;

function Svg({
  viewBox = "0 0 24 24",
  className,
  size,
  ariaHidden = true,
  children,
  ...rest
}: {
  viewBox?: string;
  className?: string;
  size?: number;
  ariaHidden?: boolean;
  children: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, "viewBox" | "className" | "children">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Navigation chrome                                                      */
/* ────────────────────────────────────────────────────────────────────── */

const CHEVRON = {
  left: "M14.5 5.5 8 12l6.5 6.5",
  right: "M9.5 5.5 16 12l-6.5 6.5",
  down: "M5.5 9.5 12 16l6.5-6.5",
};

export function ChevronLeft({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON.left} />
    </Svg>
  );
}

export function ChevronRight({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON.right} />
    </Svg>
  );
}

export function ChevronDown({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON.down} />
    </Svg>
  );
}

export function ChevronIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON.right} />
    </Svg>
  );
}

export function ChevronLeftIcon({
  direction,
  className = "h-4 w-4",
  size,
  ...rest
}: { direction: "left" | "right" } & IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON[direction]} />
    </Svg>
  );
}

export function ChevronLeftRightIcon({
  direction,
  className = "h-[13px] w-[13px]",
  size,
  ...rest
}: { direction: "left" | "right" } & IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d={CHEVRON[direction]} />
    </Svg>
  );
}

export function X({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M7 7l10 10" />
      <path d="M17 7 7 17" />
    </Svg>
  );
}

export function PlusIcon({
  className = "h-[13px] w-[13px]",
  size,
  ...rest
}: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M12 4v16" />
      <path d="M4 12h16" />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Utility / commerce                                                     */
/* ────────────────────────────────────────────────────────────────────── */

export function Search({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function Person({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5 20.2c0-3.6 3.2-6.1 7-6.1s7 2.5 7 6.1" />
    </Svg>
  );
}

export function Bag({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M6.5 8h11l-.9 11.3a2 2 0 0 1-2 1.85H9.4a2 2 0 0 1-2-1.85L6.5 8Z" />
      <path d="M9 8V6.8a3 3 0 0 1 6 0V8" />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Email / phone                                                           */
/* ────────────────────────────────────────────────────────────────────── */

function EnvelopeGlyph() {
  return (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.2 12 13 20.5 6.2" />
    </>
  );
}

export function Mail({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <EnvelopeGlyph />
    </Svg>
  );
}

export function EmailIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <EnvelopeGlyph />
    </Svg>
  );
}

function HandsetGlyph() {
  return (
    <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.03-.24c1.1.37 2.28.57 3.47.6a1 1 0 0 1 .97 1v3.36a1 1 0 0 1-1.02 1.05C10.63 21.13 2.87 13.37 2 4.65A1 1 0 0 1 3.05 3.6h3.36a1 1 0 0 1 1 .97c.03 1.19.23 2.37.6 3.47a1 1 0 0 1-.24 1.03Z" />
  );
}

export function Phone({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <HandsetGlyph />
    </Svg>
  );
}

export function PhoneIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <HandsetGlyph />
    </Svg>
  );
}

export function Instagram({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="6" />
      <circle cx="12" cy="12" r="4.1" />
      <circle
        cx="16.7"
        cy="7.3"
        r="0.9"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function WhatsAppIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M12 3a9 9 0 0 0-7.79 13.44L3 21l4.68-1.19A9 9 0 1 0 12 3Z" />
      <path
        d="M8.7 8.9c.27-.6.53-.62.77-.63.2 0 .4 0 .58.01.2.02.46.08.56.36l.6 1.44a.55.55 0 0 1-.06.53l-.46.6a.4.4 0 0 0-.03.42 5.6 5.6 0 0 0 2.46 2.46.4.4 0 0 0 .42-.03l.6-.46a.55.55 0 0 1 .53-.06l1.44.6c.28.11.34.36.36.56.01.18.01.38.01.58 0 .24-.03.5-.63.77-.6.27-1.42.2-2.75-.36a8.5 8.5 0 0 1-3.8-3.8c-.56-1.33-.63-2.15-.36-2.75Z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Heart / wishlist                                                        */
/* ────────────────────────────────────────────────────────────────────── */

const HEART_PATH =
  "M12 20.35c-.22 0-.43-.08-.6-.22C7.85 17.5 3 13.55 3 9.35 3 6.4 5.32 4 8.24 4c1.62 0 3.1.77 3.76 2.02C12.66 4.77 14.14 4 15.76 4 18.68 4 21 6.4 21 9.35c0 4.2-4.85 8.15-8.4 10.78-.17.14-.38.22-.6.22Z";

export function Heart({
  className,
  size,
  filled = false,
  ...rest
}: IconProps & { filled?: boolean }) {
  return (
    <Svg
      className={className}
      size={size}
      fill={filled ? "currentColor" : "none"}
      {...rest}
    >
      <path d={HEART_PATH} />
    </Svg>
  );
}

export function HeartIcon({
  filled,
  className = "h-[17px] w-[17px]",
  size,
  ...rest
}: { filled: boolean } & IconProps) {
  return (
    <Svg
      className={className}
      size={size}
      fill={filled ? "currentColor" : "none"}
      {...rest}
    >
      <path d={HEART_PATH} />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Content / marketing                                                     */
/* ────────────────────────────────────────────────────────────────────── */

export function Moon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </Svg>
  );
}

export function CalendarIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.5" />
      <path d="M16 3v3.5" />
      <circle
        cx="8.25"
        cy="14.25"
        r="1"
        fill="currentColor"
        stroke="none"
      />
      <circle
        cx="12"
        cy="14.25"
        r="1"
        fill="currentColor"
        stroke="none"
      />
      <circle
        cx="15.75"
        cy="14.25"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function ChartIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M4 17l5.5-5.5L13 15l6.5-7.5" />
      <path d="M15.5 7h4v4" />
    </Svg>
  );
}

export function GemIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M9 4h6l5 4-8 13-8-13Z" />
      <path d="M4 8h16" />
      <path d="M9 4l3 17" />
      <path d="M15 4l-3 17" />
    </Svg>
  );
}

export function StarIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M12 2.7 14.12 9.09 20.85 9.13 15.42 13.11 17.47 19.52 12 15.6 6.53 19.52 8.58 13.11 3.16 9.13 9.88 9.09Z" />
    </Svg>
  );
}

export function SparkleIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg
      className={className}
      size={size}
      fill="currentColor"
      {...rest}
    >
      <path
        d="M12 2c.3 3.4 1 6.3 2.2 7.8C15.4 11 18.3 11.7 21.7 12c-3.4.3-6.3 1-7.8 2.2C12.7 15.4 12 18.3 12 21.7c-.3-3.4-1-6.3-2.2-7.8C8.6 12.7 5.7 12 2.3 12c3.4-.3 6.3-1 7.8-2.2C11.3 8.6 12 5.7 12 2Z"
        stroke="none"
      />
    </Svg>
  );
}

export function AlertIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6" />
      <circle
        cx="12"
        cy="16.8"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

export function ShieldIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M12 3.4 19.2 6v4.8c0 5.1-3 8.3-7.2 9.8-4.2-1.5-7.2-4.7-7.2-9.8V6Z" />
      <path d="M9 12.2 11 14.2 15 10" />
    </Svg>
  );
}

export function CheckIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      <path d="M5 12.5 9.3 16.8 19 7" />
    </Svg>
  );
}

export function ImageFallbackIcon({
  className = "h-8 w-8 text-[color:var(--ink-mute)]",
  size,
  ...rest
}: IconProps) {
  return (
    <Svg
      className={className}
      size={size}
      strokeWidth={1.3}
      {...rest}
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M4.5 17 9.5 12l3.5 3.5 2.5-2.5 4 4" />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Customized Bracelet Journey icons                                      */
/* ────────────────────────────────────────────────────────────────────── */

/**
 * Token / ₹150 payment icon.
 *
 * Represents the initial consultation token payment.
 */
export function TokenIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Coin */}
      <circle cx="12" cy="12" r="8.5" />

      {/* Rupee symbol */}
      <path d="M9 8h6" />
      <path d="M9 11h5" />
      <path d="M10 8c2.8 0 4.2 1.1 4.2 3s-1.4 3-4.2 3" />
      <path d="m10 14 4 4" />
    </Svg>
  );
}

/**
 * Astrology consultation / expert conversation icon.
 *
 * Represents the stage where the customer reaches an astrology expert.
 */
export function ConsultationIcon({
  className,
  size,
  ...rest
}: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Head */}
      <circle cx="12" cy="8" r="3" />

      {/* Shoulders */}
      <path d="M5.5 20c.5-3.4 2.7-5.3 6.5-5.3s6 1.9 6.5 5.3" />

      {/* Conversation / consultation indicator */}
      <path d="M17.5 4.5h3v3" />
      <path d="M20.5 4.5 17 8" />
    </Svg>
  );
}

/**
 * Kundli / birth-chart icon.
 *
 * Represents collecting and analysing Kundli details.
 */
export function KundliIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Chart frame */}
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />

      {/* Kundli diamond geometry */}
      <path d="M12 3.5v17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 3.5 12 12l8.5-8.5" />
      <path d="M3.5 20.5 12 12l8.5 8.5" />

      {/* Center point */}
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

/**
 * Gemstone / recommended stones icon.
 *
 * Represents gemstone selection based on planetary analysis.
 */
export function GemstoneIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Gem outline */}
      <path d="M7.5 4h9l4 5-8.5 11-8.5-11 4-5Z" />

      {/* Facets */}
      <path d="M3.5 9h17" />
      <path d="M7.5 4 12 9l4.5-5" />
      <path d="m7.5 4 4.5 16" />
      <path d="m16.5 4-4.5 16" />
    </Svg>
  );
}

/**
 * Astrology report / document icon.
 *
 * Represents the personalized astrology report prepared after analysis.
 */
export function ReportIcon({ className, size, ...rest }: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Document */}
      <path d="M7 3.5h7l3.5 3.5V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" />

      {/* Folded corner */}
      <path d="M14 3.5V7h3.5" />

      {/* Report lines */}
      <path d="M9 11h6" />
      <path d="M9 14.5h6" />
      <path d="M9 18h4" />

      {/* Small astrology/star mark */}
      <circle
        cx="10"
        cy="7.5"
        r="0.7"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  );
}

/**
 * Final payment / order confirmation icon.
 *
 * Represents the final bracelet payment after the personalized
 * recommendation/report has been completed.
 */
export function ShieldCheckIcon({
  className,
  size,
  ...rest
}: IconProps) {
  return (
    <Svg className={className} size={size} {...rest}>
      {/* Shield */}
      <path d="M12 3.2 19.2 6v4.7c0 5.2-3 8.5-7.2 10.1-4.2-1.6-7.2-4.9-7.2-10.1V6Z" />

      {/* Check */}
      <path d="M8.5 12.2 11 14.7l4.8-5" />
    </Svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* Social icons                                                            */
/* ────────────────────────────────────────────────────────────────────── */

type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "whatsapp";

export const SocialIcon = ({
  platform,
}: {
  platform: SocialPlatform;
}) => {
  const common = "w-[18px] h-[18px]";

  switch (platform) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="17.2"
            cy="6.8"
            r="1.1"
            fill="currentColor"
          />
        </svg>
      );

    case "facebook":
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14.5 8.5h2V5.6c-.35-.05-1.53-.15-2.9-.15-2.87 0-4.84 1.75-4.84 4.97v2.48H6v3.24h3.26V21h3.35v-4.86h3.12l.5-3.24h-3.62v-2.14c0-.94.26-1.58 1.89-1.58Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="6"
            width="19"
            height="12"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10.5 9.5v5l4.3-2.5-4.3-2.5Z"
            fill="currentColor"
          />
        </svg>
      );

    case "whatsapp":
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L3.5 20.5l4.45-1.27A8.4 8.4 0 1 0 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.7 8.6c.2-.45.4-.46.6-.47h.5c.16 0 .38-.06.58.44s.7 1.7.76 1.83.1.28.02.44a1.7 1.7 0 0 1-.27.4c-.14.16-.28.35-.4.47-.14.14-.28.29-.12.57.16.28.72 1.18 1.55 1.9 1.06.94 1.96 1.23 2.24 1.37s.44.12.6-.07.7-.8.89-1.08.37-.23.63-.14 1.63.77 1.9.9.46.2.53.32.07.65-.15 1.28-.22.63-1.28 1.24-1.77 1.27-1.6-.1a14.4 14.4 0 0 1-1.47-.55 11.4 11.4 0 0 1-4.36-3.86 5.2 5.2 0 0 1-1.08-2.75c0-.8.3-1.24.55-1.5Z"
            fill="currentColor"
          />
        </svg>
      );
  }
};