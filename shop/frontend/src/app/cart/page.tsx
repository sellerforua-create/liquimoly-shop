"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (success) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold mb-2">Замовлення прийнято!</h1>
        <p className="text-gray-400 mb-6">Ми зв'яжемось з вами найближчим часом</p>
        <a href="/catalog" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">Продовжити покупки</a>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Кошик порожній</h1>
        <a href="/catalog" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">До каталогу</a>
      </div>
    </div>
  );

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          items: items.map(i => ({ product_id: i.id, product_name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });
      if (r.ok) { clearCart(); setSuccess(true); }
      else setError("Помилка при оформленні. Спробуйте ще раз.");
    } catch { setError("Немає зв'язку з сервером."); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🛒 Кошик</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Список товарів */}
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-xl p-4 flex gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" /> : <span className="text-2xl">🛢️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 mb-2">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-700 rounded text-lg leading-none">−</button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-700 rounded text-lg leading-none">+</button>
                    </div>
                    <span className="font-bold">{(item.price * item.quantity).toFixed(0)} ₴</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-gray-800 rounded-xl p-4 flex justify-between text-xl font-bold">
              <span>Разом:</span>
              <span>{total.toFixed(0)} ₴</span>
            </div>
          </div>

          {/* Форма замовлення */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Оформити замовлення</h2>
            {!ordering ? (
              <button onClick={() => setOrdering(true)} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg">
                Оформити замовлення
              </button>
            ) : (
              <form onSubmit={handleOrder} className="space-y-4">
                <input required placeholder="Ваше ім'я *" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                <input required placeholder="Телефон *" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                <input placeholder="Адреса / відділення НП" value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-lg">
                  ✅ Підтвердити замовлення
                </button>
                <button type="button" onClick={() => setOrdering(false)} className="w-full bg-gray-700 py-3 rounded-xl text-sm">
                  Назад
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
