"use client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  vendor?: string;
  category_name?: string;
  available: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    showToast(`✅ ${product.name.slice(0, 30)}... додано до кошика`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Теги
  const isHit = product.price > 500;
  const isNew = product.id % 7 === 0;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition flex flex-col relative">
      {/* Теги */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {isHit && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">🔥 Хіт</span>}
        {isNew && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">🆕 Новинка</span>}
      </div>
      {/* Наявність */}
      <div className="absolute top-2 right-2 z-10">
        {product.available
          ? <span className="bg-green-700/80 text-green-200 text-xs px-2 py-0.5 rounded-full">✅</span>
          : <span className="bg-red-800/80 text-red-200 text-xs px-2 py-0.5 rounded-full">❌</span>}
      </div>

      <Link href={`/catalog/${product.id}`} className="block">
        <div className="h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2 hover:scale-105 transition" />
            : <span className="text-5xl">🛢️</span>}
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs text-blue-400 mb-1">{product.vendor || product.category_name}</p>
          <h3 className="text-sm font-medium text-white line-clamp-2 mb-2 h-10">{product.name}</h3>
          <p className="text-lg font-bold text-white">{product.price} ₴</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {product.available ? (
          <button onClick={handleAdd}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition ${added ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}>
            {added ? "✅ Додано!" : "🛒 До кошика"}
          </button>
        ) : (
          <div className="w-full py-2 rounded-lg text-sm text-center bg-gray-700 text-gray-400">Немає в наявності</div>
        )}
      </div>
    </div>
  );
}
