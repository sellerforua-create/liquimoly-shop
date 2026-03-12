"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories/list`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (category) params.set("category", category);

    fetch(`${API_URL}/api/products/?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data.items || []); setTotal(data.total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const pages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text" placeholder="🔍 Поиск..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white w-64 focus:outline-none focus:border-blue-500"
          />
          <select
            value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((c: any) => (
              <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
            ))}
          </select>
        </div>

        {/* Товары */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Загрузка...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Товары не найдены</div>
        ) : (
          <>
            <p className="text-gray-400 mb-4">Найдено: {total} товаров</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        {/* Пагинация */}
        {pages > 1 && (
          <div className="flex gap-2 justify-center mt-8">
            {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg ${p === page ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
