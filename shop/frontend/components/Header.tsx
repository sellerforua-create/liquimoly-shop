"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/kits", label: "🔧 Комплекти" },
  { href: "/car-selector", label: "🚗 Підбір по авто" },
  { href: "/agro", label: "🚜 Агро" },
  { href: "/b2b", label: "💼 Оптом" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const { totalCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg flex items-center gap-2">
          🛢️ <span>Liqui Moly UA</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-1.5 rounded-lg text-sm transition">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={openCart}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">
            🛒
            {totalCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalCount}
              </span>
            )}
          </button>
          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 flex flex-col gap-2">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white py-2 text-sm border-b border-gray-800 last:border-0">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
