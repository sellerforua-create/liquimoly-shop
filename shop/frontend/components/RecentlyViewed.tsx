"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const KEY = "recently_viewed";
const MAX = 5;

export function trackView(id: number) {
  try {
    const arr: number[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = arr.filter(i => i !== id);
    const updated = [id, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed({ excludeId }: { excludeId?: number }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const ids: number[] = JSON.parse(localStorage.getItem(KEY) || "[]")
        .filter((id: number) => id !== excludeId);
      if (!ids.length) return;
      Promise.all(ids.map(id => fetch(`${API_URL}/api/products/${id}`).then(r => r.ok ? r.json() : null)))
        .then(results => setProducts(results.filter(Boolean)));
    } catch {}
  }, [excludeId]);

  if (!products.length) return null;

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-white mb-4">🕐 Нещодавно переглянуті</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
