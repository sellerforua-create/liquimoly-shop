"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "../../components/ProductCard";
import ProductSkeleton from "../../components/ProductSkeleton";
import Breadcrumbs from "../../components/Breadcrumbs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Живий пошук
  const [liveQuery, setLiveQuery] = useState("");
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [liveOpen, setLiveOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const liveTimer = useRef<any>(null);

  // Закрити dropdown при кліку поза
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setLiveOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced живий пошук
  useEffect(() => {
    clearTimeout(liveTimer.current);
    if (liveQuery.length < 2) { setLiveResults([]); setLiveOpen(false); return; }
    liveTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`${API_URL}/api/products/?search=${encodeURIComponent(liveQuery)}&limit=5`);
        const d = await r.json();
        setLiveResults(d.items || []);
        setLiveOpen(true);
      } catch {}
    }, 300);
  }, [liveQuery]);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories/list`)
      .then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (sortBy) params.set("sort", sortBy);
    if (onlyAvailable) params.set("available", "true");

    fetch(`${API_URL}/api/products/?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data.items || []); setTotal(data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, page, minPrice, maxPrice, sortBy, onlyAvailable]);

  const resetFilters = () => {
    setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice("");
    setSortBy(""); setOnlyAvailable(false); setPage(1);
  };

  const pages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Каталог" }]} />
        <h1 className="text-3xl font-bold mb-6">🛍 Каталог товарів</h1>

        {/* Живий пошук */}
        <div ref={searchRef} className="relative mb-4">
          <input
            type="text"
            placeholder="🔍 Пошук товарів..."
            value={liveQuery}
            onChange={e => { setLiveQuery(e.target.value); setSearch(e.target.value); setPage(1); }}
            onKeyDown={e => e.key === "Escape" && setLiveOpen(false)}
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-base"
          />
          {liveOpen && liveResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-xl mt-1 z-20 overflow-hidden shadow-xl">
              {liveResults.map((p: any) => (
                <a key={p.id} href={`/catalog/${p.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-700 transition"
                  onClick={() => setLiveOpen(false)}>
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain" alt="" /> : <span>🛢️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-blue-400">{p.price} ₴</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Фільтри */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Категорія</label>
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
              <option value="">Всі категорії</option>
              {categories.map((c: any) => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Ціна від</label>
            <input type="number" placeholder="0" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-24 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">до</label>
            <input type="number" placeholder="9999" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-24 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Сортування</label>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
              <option value="">За замовчуванням</option>
              <option value="price_asc">Дешевше</option>
              <option value="price_desc">Дорожче</option>
              <option value="name_asc">А-Я</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={onlyAvailable} onChange={e => { setOnlyAvailable(e.target.checked); setPage(1); }}
              className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-gray-300">Тільки в наявності</span>
          </label>
          <button onClick={resetFilters} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg text-sm transition">
            ✕ Скинути
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>Товари не знайдено</p>
            <button onClick={resetFilters} className="mt-4 text-blue-400 hover:underline text-sm">Скинути фільтри</button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-4 text-sm">Знайдено: <span className="text-white font-medium">{total}</span> товарів</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        {pages > 1 && (
          <div className="flex gap-2 justify-center mt-8 flex-wrap">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-sm">← Назад</button>
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page - 3 + i;
              if (p < 1 || p > pages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm ${p === page ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"}`}
                >{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}
              className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-sm">Вперед →</button>
          </div>
        )}
      </div>
    </div>
  );
}
