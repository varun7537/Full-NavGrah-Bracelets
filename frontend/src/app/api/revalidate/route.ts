import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Poori site ka cache saaf (blog, bracelets, product detail, home)
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}