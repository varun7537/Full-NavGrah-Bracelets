import Image, { type StaticImageData } from "next/image";
import type { Purpose } from "../../data/Types";
export interface BraceletImageProps {
  purposeId: Purpose["id"];
  src?: StaticImageData;
  alt: string;
  accent: string;
  accentSoft: string;
}

export function BraceletImage({
  purposeId,
  src,
  alt,
  accent,
  accentSoft,
}: BraceletImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      sizes="(max-width: 768px) 240px, 300px"
      priority={purposeId === "focus"}
      style={{
        filter: `drop-shadow(0 12px 24px ${accent}30)`,
      }}
    />
  );
}
