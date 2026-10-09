import type { Metadata } from "next";
import "./globals.css"; 

import { AuthProvider } from "../components/Auth/AuthContext";
import { CartProvider } from "../components/cart/CartContext";
import ChatWidget from "../components/Chat/ChatWidget";

export const metadata: Metadata = {
  title: "Navgrah Bracelets",
  description: "Rashi based gemstone bracelets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}