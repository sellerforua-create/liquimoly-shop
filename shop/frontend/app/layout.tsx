import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Liqui Moly UA — Автохімія з доставкою",
  description: "Оригінальна автохімія Liqui Moly. 400+ товарів, доставка Nova Poshta по всій Україні.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-900 text-white">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
