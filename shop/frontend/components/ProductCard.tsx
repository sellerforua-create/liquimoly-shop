"use client";
import { useCart } from "../context/CartContext";
import { useState } from "react";

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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition flex flex-col">
      <a href={`/catalog/${product.id}`} className="block">
        <div className="h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
            : <span className="text-5xl">🛢️</span>}
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs text-blue-400 mb-1">{product.vendor || product.category_name}</p>
          <h3 className="text-sm font-medium text-white line-clamp-2 mb-2 h-10">{product.name}</h3>
          <p className="text-lg font-bold text-white">{product.price} ₴</p>
        </div>
      </a>
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
