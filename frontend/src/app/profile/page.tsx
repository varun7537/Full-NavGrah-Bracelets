"use client";

import PromoBar from "../../components/Header/PromoBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProfilePage from "../../components/Profile/ProfilePage";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <PromoBar />
      <Navbar />
      <ProfilePage />
      <Footer />
    </main>
  );
}