"use client";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [form, setForm] = useState({ lastName: "", firstName: "", middleName: "", phone: "" });

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 9); // максимум 9 цифр після +380
    let result = "";
    if (digits.length > 0) result += digits.slice(0, 3);
    if (digits.length > 3) result += " " + digits.slice(3, 5);
    if (digits.length > 5) result += " " + digits.slice(5, 7);
    if (digits.length > 7) result += " " + digits.slice(7, 9);
    return result;
  };

  const phoneValid = form.phone.replace(/\D/g, "").length === 9;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (success) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold mb-3">Дякуємо за замовлення!</h1>
        <p className="text-gray-400 mb-2">Ми отримали ваше замовлення і зв'яжемось найближчим часом для підтвердження.</p>
        <p className="text-gray-400 mb-8">Доставка Nova Poshta — 1-2 дні по Україні 🚚</p>

        <div className="bg-blue-900 border border-blue-700 rounded-2xl p-6 mb-6">
          <div className="text-3xl mb-3">✈️</div>
          <h2 className="text-lg font-bold mb-2">Зручніше замовляти в Telegram!</h2>
          <p className="text-gray-300 text-sm mb-4">
            Підпишіться на наш бот — отримуйте акції, нові товари та робіть замовлення прямо в Telegram без зайвих кроків
          </p>
          <a href="https://t.me/Liquimolli_bot"
            target="_blank"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/></svg>
            Відкрити @Liquimolli_bot
          </a>
        </div>

        <a href="/catalog" className="text-blue-400 hover:underline text-sm">← Продовжити покупки</a>
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
          customer_name: `${form.lastName} ${form.firstName} ${form.middleName}`.trim(),
          customer_phone: "+380" + form.phone.replace(/\D/g, ""),
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
                <input required placeholder="Прізвище *" value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                <input required placeholder="Ім'я *" value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                <input placeholder="По батькові" value={form.middleName}
                  onChange={e => setForm({...form, middleName: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
                <div className="flex">
                  <span className="bg-gray-600 border border-r-0 border-gray-600 rounded-l-lg px-4 py-3 text-gray-300 font-mono">+380</span>
                  <input required placeholder="000 00 00" value={form.phone}
                    onChange={e => setForm({...form, phone: formatPhone(e.target.value)})}
                    className={`flex-1 bg-gray-700 border rounded-r-lg px-4 py-3 focus:outline-none font-mono tracking-widest ${
                      form.phone && !phoneValid ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-blue-500"
                    }`} />
                </div>
                {form.phone && !phoneValid && <p className="text-red-400 text-xs">⚠️ Введіть 9 цифр після +380</p>}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={!phoneValid}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition">
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
