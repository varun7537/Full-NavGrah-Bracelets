import type { Metadata } from "next";
import AdminOrders from "../../../components/Admin/AdminOrders";

export const metadata: Metadata = {
  title: "Admin · Orders",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <AdminOrders />
    </main>
  );
}