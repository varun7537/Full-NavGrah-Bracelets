import PromoBar from "../../../components/Header/PromoBar";
import ProductNavbar from "../../../components/Navbar";
import ProductFooter from "../../../components/Footer";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PromoBar />
      <ProductNavbar />

      {children}

      <ProductFooter />
    </>
  );
}
