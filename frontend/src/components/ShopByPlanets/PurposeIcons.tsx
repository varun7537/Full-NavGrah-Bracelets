import type { ReactElement } from "react";
import type { Purpose } from "../../data/Types";

export interface PurposeIconProps {
  id: Purpose["id"];
  className?: string;
}

const SHARED_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FocusGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="3.25" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BalanceGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <line x1="4.5" y1="8.5" x2="19.5" y2="8.5" />
      <path d="M12 8.5 L8.5 15 M12 8.5 L15.5 15" />
      <circle cx="6" cy="8.5" r="1.35" />
      <circle cx="18" cy="8.5" r="1.35" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function ConfidenceGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M8.25 14 L12 10.25 L15.75 14" />
    </svg>
  );
}

function ProsperityGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <path d="M12 20 V11.5" />
      <path d="M12 11.5 C9 11.5 7 9.5 7 6.5 C10 6.5 12 8.5 12 11.5 Z" />
      <path d="M12 11.5 C15 11.5 17 9.5 17 6.5 C14 6.5 12 8.5 12 11.5 Z" />
    </svg>
  );
}

function CalmGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <path d="M3.5 9.5 C5.5 7.5 7.5 7.5 9.5 9.5 C11.5 11.5 13.5 11.5 15.5 9.5 C17.5 7.5 19.5 7.5 20.5 9.5" />
      <path d="M3.5 14.5 C5.5 12.5 7.5 12.5 9.5 14.5 C11.5 16.5 13.5 16.5 15.5 14.5 C17.5 12.5 19.5 12.5 20.5 14.5" />
    </svg>
  );
}

function StrengthGlyph() {
  return (
    <svg {...SHARED_PROPS} aria-hidden="true">
      <path d="M3 18 L9 7.5 L12.5 13 L15.5 8.5 L21 18 Z" />
    </svg>
  );
}

const ICONS: Record<Purpose["id"], () => ReactElement> = {
  focus: FocusGlyph,
  balance: BalanceGlyph,
  confidence: ConfidenceGlyph,
  prosperity: ProsperityGlyph,
  calm: CalmGlyph,
  strength: StrengthGlyph,
};

export function PurposeIcon({ id, className }: PurposeIconProps) {
  const Glyph = ICONS[id];

  return (
    <span className={className}>
      <Glyph />
    </span>
  );
}
