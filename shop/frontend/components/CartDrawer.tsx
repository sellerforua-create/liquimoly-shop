"use client";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={closeCart} />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-700 z-50 flex flex-col shadow-2xl
        transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">🛒 Кошик {count > 0 && <span className="text-sm text-gray-400 font-normal">({count} товарів)</span>}</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
            <span className="text-5xl">🛒</span>
            <p>Кошик порожній</p>
            <button onClick={() => { closeCart(); router.push("/catalog"); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm">
              До каталогу
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-xl p-3 flex gap-3">
                  <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                      : <span className="text-2xl">🛢️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white line-clamp-2 mb-2">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-700 rounded text-sm leading-none hover:bg-gray-600">−</button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-700 rounded text-sm leading-none hover:bg-gray-600">+</button>
                      </div>
                      <span className="text-sm font-bold text-white">{(item.price * item.quantity).toFixed(0)}₴</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 space-y-3">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Разом:</span>
                <span>{total.toFixed(0)} ₴</span>
              </div>
              <button onClick={() => { closeCart(); router.push("/cart"); }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition">
                ✅ Оформити замовлення
              </button>
              <button onClick={closeCart}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-xl text-sm transition">
                Продовжити покупки
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
