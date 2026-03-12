"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/kits", label: "Комплекти" },
  { href: "/car-selector", label: "Підбір по авто" },
  { href: "/agro", label: "Агро" },
  { href: "/b2b", label: "Оптом" },
];

export default function Header() {
  const { totalCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[rgba(6,8,24,0.95)] backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
            🛢️
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Liqui<span className="gradient-text">Moly</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all hover:bg-white/5">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={openCart}
            className="btn-glow relative px-4 py-2 text-sm flex items-center gap-2">
            <span>🛒</span>
            <span className="hidden sm:inline">Кошик</span>
            {totalCount > 0 && (
              <span className="pulse-badge absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden glass px-3 py-2 text-slate-300 hover:text-white transition-colors">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass mx-4 mb-3 rounded-2xl overflow-hidden">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
              className="flex items-center px-5 py-3 text-slate-300 hover:text-white hover:bg-white/5 text-sm border-b border-white/5 last:border-0 transition-colors">
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
