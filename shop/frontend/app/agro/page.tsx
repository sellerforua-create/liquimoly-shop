"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import Breadcrumbs from "../../components/Breadcrumbs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AGRO_CATEGORIES = [
  { key: "Масла для садовой техники", label: "🌿 Садова техніка", icon: "🌿" },
  { key: "Трансмиссионные масла", label: "⚙️ Трансмісійні", icon: "⚙️" },
  { key: "Минеральные масла", label: "🛢️ Мінеральні (трактори)", icon: "🛢️" },
  { key: "Технологические жидкости", label: "💧 Технологічні рідини", icon: "💧" },
  { key: "Смазки", label: "🔧 Мастила", icon: "🔧" },
];

const AGRO_TIPS = [
  { icon: "🚜", title: "МТЗ / ЮМЗ", desc: "15W-40, SAE 30 мінеральне, трансмісійне ТАД-17" },
  { icon: "🌾", title: "Комбайни Claas/Case", desc: "10W-40 синтетика, гідравлічне HVLP 46" },
  { icon: "🪚", title: "Бензопили", desc: "2-тактне масло, масло для ланцюга" },
  { icon: "🏡", title: "Газонокосарки", desc: "SAE HD 30, 4-тактне 10W-30" },
  { icon: "💧", title: "Оприскувачі", desc: "Змазки для підшипників, антифриз" },
  { icon: "⚡", title: "Генератори", desc: "Universal 4-T 10W-30, синтетика 5W-30" },
];

export default function AgroPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const categories = AGRO_CATEGORIES.map(c => c.key);
    Promise.all(
      categories.map(cat =>
        fetch(`${API_URL}/api/products/?category=${encodeURIComponent(cat)}&limit=20`)
          .then(r => r.json()).then(d => d.items || []).catch(() => [])
      )
    ).then(results => {
      const all = results.flat();
      // Унікальні
      const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
      setProducts(unique);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category_name === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Агротехніка" }]} />

        {/* Hero */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🚜</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Мастила для агротехніки</h1>
              <p className="text-green-300 mt-1">Liqui Moly для тракторів, комбайнів, садової техніки</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-green-800 border border-green-600 rounded-lg px-4 py-2 text-sm">
              ✅ Оригінальна продукція
            </div>
            <div className="bg-green-800 border border-green-600 rounded-lg px-4 py-2 text-sm">
              📦 Є великі об'єми (20L, 60L)
            </div>
            <div className="bg-green-800 border border-green-600 rounded-lg px-4 py-2 text-sm">
              🚚 Доставка Nova Poshta
            </div>
            <Link href="/b2b" className="bg-yellow-600 hover:bg-yellow-500 border border-yellow-500 rounded-lg px-4 py-2 text-sm font-bold transition">
              💼 Оптові ціни для фермерів →
            </Link>
          </div>
        </div>

        {/* Підбір по техніці */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">🔍 Підбір по типу техніки</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AGRO_TIPS.map(t => (
              <div key={t.title} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-semibold text-white text-sm">{t.title}</span>
                </div>
                <p className="text-gray-400 text-xs">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Фільтр категорій */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === "all" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
            Всі ({products.length})
          </button>
          {AGRO_CATEGORIES.map(c => {
            const cnt = products.filter(p => p.category_name === c.key).length;
            if (!cnt) return null;
            return (
              <button key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === c.key ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                {c.icon} {c.label.replace(/^[^ ]+ /, "")} ({cnt})
              </button>
            );
          })}
        </div>

        {/* Товари */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">Товарів не знайдено</p>
        )}

        {/* CTA B2B */}
        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Потрібен великий об'єм? 🛢️</h2>
          <p className="text-gray-400 mb-5">Бочки 20L, 60L, 208L для СТО та фермерських господарств. Індивідуальні ціни.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/b2b" className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-8 py-3 rounded-xl transition">
              💼 Оптове замовлення
            </Link>
            <a href="https://t.me/Liquimolli_bot" target="_blank"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition">
              ✈️ Написати в Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
