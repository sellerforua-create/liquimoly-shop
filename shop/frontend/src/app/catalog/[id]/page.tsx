"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Загрузка...</div>;
  if (!product) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Товар не найден</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/catalog" className="text-blue-400 hover:underline mb-6 block">← Назад в каталог</a>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Фото */}
          <div className="bg-gray-800 rounded-xl p-6 flex items-center justify-center h-80">
            {product.image_url
              ? <img src={product.image_url} alt={product.name} className="max-h-full object-contain" />
              : <span className="text-8xl">🛢️</span>
            }
          </div>

          {/* Инфо */}
          <div>
            <p className="text-blue-400 text-sm mb-2">{product.vendor} • {product.category_name}</p>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-4xl font-bold text-white mb-2">{product.price} ₴</p>
            {product.vendor_code && <p className="text-gray-400 text-sm mb-4">Арт: {product.vendor_code}</p>}

            <div className={`inline-block px-3 py-1 rounded-full text-sm mb-6 ${product.available ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
              {product.available ? "✅ В наличии" : "❌ Нет в наличии"}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition mb-3">
              🛒 Добавить в корзину
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition">
              📞 Купить в 1 клик
            </button>
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Описание</h2>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
