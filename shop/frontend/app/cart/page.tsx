"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";

const PROMOS: Record<string, number> = { LIQUI10: 10, FIRST5: 5, SALE15: 15 };

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQty, clearCart } = useCart();
  const [form, setForm] = useState({ lastName: "", firstName: "", middleName: "", phone: "" });
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const discount = promoApplied ? PROMOS[promoApplied] : 0;
  const finalPrice = Math.round(totalPrice * (1 - discount / 100));

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromoApplied(code);
      setPromoError("");
    } else {
      setPromoError("Невірний промокод");
      setPromoApplied(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+?380\d{9}$/.test(form.phone.replace(/\s/g, ""))) return alert("Некоректний номер +380XXXXXXXXX");
    setSubmitting(true);
    const BOT_TOKEN = "8644972775:AAHT94GCBd-25eFsmEFLp9Ph1JFnCpfJ7i8";
    const CHAT_ID = "455255915";
    const itemsList = items.map(i => `• ${i.name.slice(0, 40)} x${i.qty} = ${(i.price * i.qty).toFixed(0)}₴`).join("\n");
    const text = `🛒 НОВЕ ЗАМОВЛЕННЯ з сайту\n\n👤 ${form.lastName} ${form.firstName} ${form.middleName}\n📞 ${form.phone}\n${promoApplied ? `🎁 Промокод: ${promoApplied} (-${discount}%)\n` : ""}\n${itemsList}\n\n💰 Сума: ${finalPrice}₴`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
    } catch {}
    clearCart();
    setSuccess(true);
    setSubmitting(false);
  };

  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-3">Замовлення прийнято!</h2>
        <p className="text-slate-400 mb-2">Ми зв'яжемося з вами найближчим часом</p>
        <p className="text-slate-500 text-sm mb-6">Або пишіть нам одразу в Telegram</p>
        <div className="flex flex-col gap-3">
          <a href="https://t.me/Liquimolli_bot" target="_blank" className="btn-glow py-3 text-sm text-center">✈️ Відкрити бот</a>
          <Link href="/catalog" className="glass glass-hover py-3 text-sm text-center rounded-xl text-slate-300 font-semibold">Продовжити покупки</Link>
        </div>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-4 opacity-20">🛒</div>
        <h2 className="text-xl font-bold text-white mb-3">Кошик порожній</h2>
        <Link href="/catalog" className="btn-glow inline-block px-8 py-3 text-sm mt-2">🛍 В каталог</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Кошик" }]} />
        <h1 className="text-2xl font-bold text-white mb-6">Ваш кошик</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Товари */}
          <div className="md:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="glass p-4 flex gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.image_url ? <img src={item.image_url} className="w-full h-full object-contain p-1" alt="" /> : <span className="text-2xl">🛢️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/catalog/${item.id}`} className="text-white text-sm font-medium line-clamp-2 hover:text-blue-300 transition-colors">{item.name}</Link>
                  <p className="text-blue-400 font-black mt-1">{(item.price * item.qty).toFixed(0)} ₴</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="glass w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg text-sm">−</button>
                    <span className="text-white text-sm w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="glass w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg text-sm">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-slate-600 hover:text-red-400 text-sm transition-colors">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Підсумок + форма */}
          <div className="space-y-4">
            {/* Промокод */}
            <div className="glass p-4">
              <p className="text-slate-400 text-xs mb-2 font-medium">🎁 Промокод</p>
              <div className="flex gap-2">
                <input value={promo} onChange={e => setPromo(e.target.value.toUpperCase())}
                  placeholder="LIQUI10"
                  className="input-dark flex-1 text-xs py-2" />
                <button onClick={applyPromo} className="btn-glow px-3 py-2 text-xs">OK</button>
              </div>
              {promoApplied && <p className="text-green-400 text-xs mt-2">✅ -{discount}% застосовано</p>}
              {promoError && <p className="text-red-400 text-xs mt-2">❌ {promoError}</p>}
            </div>

            {/* Сума */}
            <div className="glass p-4">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Товарів:</span><span className="text-white">{items.reduce((s,i) => s+i.qty, 0)} шт</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Знижка:</span>
                  <span className="text-green-400">-{(totalPrice - finalPrice).toFixed(0)} ₴</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t border-white/8">
                <span className="text-white">Разом:</span>
                <span className="gradient-text">{finalPrice} ₴</span>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="glass p-4 space-y-3">
              <p className="text-white font-semibold text-sm mb-1">📋 Дані для доставки</p>
              {[
                { key: "lastName", placeholder: "Прізвище" },
                { key: "firstName", placeholder: "Ім'я" },
                { key: "middleName", placeholder: "По батькові" },
                { key: "phone", placeholder: "+380XXXXXXXXX" },
              ].map(f => (
                <input key={f.key} required value={(form as any)[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder}
                  className="input-dark text-sm" />
              ))}
              <button type="submit" disabled={submitting}
                className="btn-glow w-full py-3 text-sm">
                {submitting ? "⏳ Відправляємо..." : "✅ Оформити замовлення"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
