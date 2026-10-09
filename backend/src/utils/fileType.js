/**
 * File ka asli type bytes se pehchano. Client ka bheja hua mimetype ya extension par bharosa nahi.
 * Allowed: PDF, JPEG, PNG, WebP. Kuch aur ho to null.
 */
export function detectFileType(buf) {
  if (!buf || buf.length < 12) return null;

  if (buf.slice(0, 4).toString("latin1") === "%PDF") return "application/pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.slice(0, 4).toString("latin1") === "RIFF" && buf.slice(8, 12).toString("latin1") === "WEBP") {
    return "image/webp";
  }
  return null;
}