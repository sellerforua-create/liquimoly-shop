"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const LINKS = [
  { href: "/", icon: "🏠", label: "Головна" },
  { href: "/catalog", icon: "🛍", label: "Каталог" },
  { href: "/car-selector", icon: "🚗", label: "Підбір" },
  { href: "/agro", icon: "🚜", label: "Агро" },
  { href: "/b2b", icon: "💼", label: "Оптом" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 border-t"
      style={{ background: "rgba(6,8,24,0.97)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex justify-around items-center h-16 px-2">
        {LINKS.map(l => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                active ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
              }`}>
              <span className="text-xl">{l.icon}</span>
              <span className="text-[10px] font-medium">{l.label}</span>
            </Link>
          );
        })}
        {/* Cart */}
        <button onClick={openCart}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-slate-500 hover:text-slate-300 transition-all relative">
          <span className="text-xl">🛒</span>
          <span className="text-[10px] font-medium">Кошик</span>
          {totalCount > 0 && (
            <span className="absolute -top-0.5 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
