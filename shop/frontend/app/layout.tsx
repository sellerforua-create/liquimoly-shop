import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import BottomNav from "../components/BottomNav";
import ExitPopup from "../components/ExitPopup";
import AnnouncementBar from "../components/AnnouncementBar";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "Liqui Moly UA — Автохімія з доставкою",
  description: "Оригінальна автохімія Liqui Moly. 485+ товарів, доставка Nova Poshta по всій Україні.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="pb-16 md:pb-0 flex flex-col min-h-screen">
        <CartProvider>
          <ToastProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <BottomNav />
            <ExitPopup />
            <ScrollToTop />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
