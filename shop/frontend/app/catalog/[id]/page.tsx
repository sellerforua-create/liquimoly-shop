"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SocialProof from "../../../components/SocialProof";
import Reviews from "../../../components/Reviews";
import RecentlyViewed, { trackView } from "../../../components/RecentlyViewed";
import ProductCard from "../../../components/ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(p => {
        setProduct(p);
        trackView(Number(id));
        if (p.category_name) {
          fetch(`${API_URL}/api/products/?category=${encodeURIComponent(p.category_name)}&limit=5`)
            .then(r => r.json())
            .then(d => setSimilar((d.items || []).filter((x: any) => x.id !== p.id).slice(0, 4)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addItem(product);
    showToast(`✅ ${product.name.slice(0, 30)}... додано до кошика`);
    openCart();
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Товар не знайдено</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Головна", href: "/" },
          { label: "Каталог", href: "/catalog" },
          { label: product.category_name || "Товар", href: `/catalog?category=${encodeURIComponent(product.category_name || "")}` },
          { label: product.name.slice(0, 40) },
        ]} />

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Фото */}
          <div className={`bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center h-80 md:h-96 cursor-zoom-in transition-all ${zoom ? "scale-150 cursor-zoom-out" : ""}`}
            onClick={() => setZoom(!zoom)}>
            {product.image_url
              ? <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-4 transition-transform hover:scale-110" />
              : <span className="text-8xl">🛢️</span>}
          </div>

          {/* Деталі */}
          <div>
            <p className="text-blue-400 text-sm mb-1">{product.vendor} · {product.category_name}</p>
            <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
            {product.vendor_code && <p className="text-gray-500 text-xs mb-3">Артикул: {product.vendor_code}</p>}

            <SocialProof productId={product.id} />

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold text-white">{product.price} ₴</span>
              {product.available
                ? <span className="text-green-400 text-sm font-medium">✅ В наявності</span>
                : <span className="text-red-400 text-sm">❌ Немає в наявності</span>}
            </div>

            {product.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {product.available && (
              <button onClick={handleAdd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition mb-3">
                🛒 До кошика
              </button>
            )}
          </div>
        </div>

        {/* Схожі товари */}
        {similar.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Схожі товари 🛢️</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        <Reviews />
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
