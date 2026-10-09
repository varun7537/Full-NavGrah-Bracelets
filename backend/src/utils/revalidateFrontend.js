/** Next.js ko batata hai ki cache saaf karo. Fail ho jaye to bhi sync nahi rukta. */
export async function revalidateFrontend() {
  const base = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn("⚠️ Frontend revalidate failed:", res.status);
  } catch (e) {
    console.warn("⚠️ Frontend revalidate error:", e.message);
  }
}