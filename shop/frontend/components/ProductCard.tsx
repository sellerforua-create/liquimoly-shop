"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }: { product: any }) {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const isHit = product.price > 500;
  const isNew = product.id % 7 === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    showToast(`✅ Додано: ${product.name.slice(0, 30)}...`);
    openCart();
  };

  return (
    <div className="glass product-card shine group flex flex-col overflow-hidden border-glow">
      <Link href={`/catalog/${product.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full h-40 flex items-center justify-center bg-white/[0.02] border-b border-white/5">
          {product.image_url
            ? <img src={product.image_url} alt={product.name}
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
            : <span className="text-5xl opacity-40">🛢️</span>}

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isHit && <span className="tag-hot text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🔥 Хіт</span>}
            {isNew && <span className="tag-new text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🆕 Новинка</span>}
          </div>

          {/* Availability */}
          <div className="absolute top-2 right-2">
            {product.available
              ? <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] px-2 py-0.5 rounded-full">✅</span>
              : <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] px-2 py-0.5 rounded-full">❌</span>}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex-1 flex flex-col gap-1">
          <p className="text-slate-500 text-[10px] uppercase tracking-wide">{product.vendor}</p>
          <h3 className="text-white text-xs font-medium leading-snug line-clamp-3 group-hover:text-blue-300 transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-2">
            <p className="text-white font-black text-lg">{product.price} <span className="text-slate-400 text-sm font-normal">₴</span></p>
          </div>
        </div>
      </Link>

      {/* Add button */}
      {product.available && (
        <button onClick={handleAdd}
          className="mx-3 mb-3 btn-glow py-2 text-xs text-center w-[calc(100%-24px)]">
          До кошика
        </button>
      )}
    </div>
  );
}
