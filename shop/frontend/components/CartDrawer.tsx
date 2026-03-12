"use client";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { items, totalPrice, isOpen, closeCart, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-[101] flex flex-col transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`} style={{ background: "rgba(10,12,28,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h2 className="text-white font-bold text-lg">🛒 Кошик</h2>
            <p className="text-slate-500 text-xs">{items.length} товарів</p>
          </div>
          <button onClick={closeCart}
            className="glass w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4 opacity-20">🛒</div>
              <p className="text-slate-500">Кошик порожній</p>
              <button onClick={closeCart}
                className="mt-4 btn-glow px-6 py-2 text-sm">
                Перейти до каталогу
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="glass p-3 flex gap-3">
                {/* Img */}
                <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image_url
                    ? <img src={item.image_url} className="w-full h-full object-contain p-1" alt="" />
                    : <span className="text-2xl">🛢️</span>}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/catalog/${item.id}`} onClick={closeCart}
                    className="text-white text-xs font-medium line-clamp-2 hover:text-blue-300 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-blue-400 font-black text-sm mt-1">{(item.price * item.qty).toFixed(0)} ₴</p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      className="glass w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white text-xs transition-colors rounded">
                      −
                    </button>
                    <span className="text-white text-xs w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="glass w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white text-xs transition-colors rounded">
                      +
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="ml-auto text-slate-600 hover:text-red-400 text-xs transition-colors">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/8 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Сума:</span>
              <span className="text-white font-black text-xl">{totalPrice.toFixed(0)} ₴</span>
            </div>
            <Link href="/cart" onClick={closeCart}
              className="btn-glow block text-center py-3 text-sm w-full">
              Оформити замовлення →
            </Link>
            <button onClick={closeCart}
              className="glass glass-hover w-full py-2 text-slate-400 hover:text-white text-sm transition-colors rounded-xl text-center">
              Продовжити покупки
            </button>
          </div>
        )}
      </div>
    </>
  );
}
