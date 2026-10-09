import PromoBar from "../../components/Header/PromoBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PromoBar />
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
