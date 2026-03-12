"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          🛢️ <span className="text-blue-400">Liqui Moly UA</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-gray-300">
          <Link href="/catalog" className="hover:text-white transition">Каталог</Link>
          <Link href="/about" className="hover:text-white transition">Про нас</Link>
          <Link href="/contacts" className="hover:text-white transition">Контакти</Link>
        </nav>
        <Link href="/cart" className="relative bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          🛒 Кошик
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
