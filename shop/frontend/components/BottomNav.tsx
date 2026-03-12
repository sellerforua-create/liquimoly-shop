"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();

  const active = (path: string) =>
    pathname === path ? "text-blue-400" : "text-gray-400 hover:text-white";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 md:hidden">
      <div className="flex justify-around py-2">
        <Link href="/" className={`flex flex-col items-center gap-1 text-xs px-3 py-1 ${active("/")}`}>
          <span className="text-xl">🏠</span>
          <span>Головна</span>
        </Link>
        <Link href="/catalog" className={`flex flex-col items-center gap-1 text-xs px-3 py-1 ${active("/catalog")}`}>
          <span className="text-xl">🛍</span>
          <span>Каталог</span>
        </Link>
        <Link href="/catalog?search=1" className="flex flex-col items-center gap-1 text-xs px-3 py-1 text-gray-400 hover:text-white">
          <span className="text-xl">🔍</span>
          <span>Пошук</span>
        </Link>
        <button onClick={openCart} className="flex flex-col items-center gap-1 text-xs px-3 py-1 text-gray-400 hover:text-white relative">
          <span className="text-xl">🛒</span>
          {count > 0 && (
            <span className="absolute top-0 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
          <span>Кошик</span>
        </button>
      </div>
    </nav>
  );
}
