import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          🛢️ <span className="text-blue-400">LiquiShop</span>
        </Link>
        <nav className="flex gap-6 text-gray-300">
          <Link href="/catalog" className="hover:text-white transition">Каталог</Link>
          <Link href="/about" className="hover:text-white transition">О нас</Link>
          <Link href="/contacts" className="hover:text-white transition">Контакты</Link>
        </nav>
        <Link href="/cart" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          🛒 Корзина
        </Link>
      </div>
    </header>
  );
}
