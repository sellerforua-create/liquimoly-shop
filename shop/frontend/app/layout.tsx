import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import BottomNav from "../components/BottomNav";
import ExitPopup from "../components/ExitPopup";

export const metadata: Metadata = {
  title: "Liqui Moly UA — Автохімія з доставкою",
  description: "Оригінальна автохімія Liqui Moly. 400+ товарів, доставка Nova Poshta по всій Україні.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-900 text-white pb-16 md:pb-0">
        <CartProvider>
          <ToastProvider>
            <Header />
            {children}
            <CartDrawer />
            <BottomNav />
            <ExitPopup />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
