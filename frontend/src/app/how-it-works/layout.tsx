import PromoBar from "../../components/Header/PromoBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PromoBar />
      <Navbar />

      {children}

      <Footer />
    </>
  );
}