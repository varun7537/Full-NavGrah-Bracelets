import type { Metadata } from "next";
import OrderTrackingPage from "../../components/cart/OrderTrackingPage";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track your Navgrah Bracelets order with your order ID.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const { id } = await searchParams;
  const initialId = (Array.isArray(id) ? id[0] : id) ?? "";

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <OrderTrackingPage initialId={initialId} />
    </main>
  );
}