"use client";
import { useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

const VOLUMES = [
  { icon: "🧴", label: "1L", desc: "Для авто / мотоцикла" },
  { icon: "🪣", label: "4–5L", desc: "Стандартна заміна" },
  { icon: "🛢️", label: "20L каністра", desc: "Дрібне СТО / фермер" },
  { icon: "🛢️", label: "60L бочка", desc: "СТО, автопарк" },
  { icon: "🛢️🛢️", label: "208L бочка", desc: "Завод, великий автопарк" },
];

const BENEFITS = [
  { icon: "💰", title: "Оптові ціни", desc: "Від -10% до -25% залежно від об'єму замовлення" },
  { icon: "📋", title: "Документи", desc: "Рахунок-фактура, накладна, акт для підприємств" },
  { icon: "🚚", title: "Доставка", desc: "Nova Poshta, Meest, самовивіз у вашому місті" },
  { icon: "🔄", title: "Регулярні поставки", desc: "Домовляємось на сезон, привозимо за графіком" },
  { icon: "📞", title: "Особистий менеджер", desc: "Ваш контакт — завжди на зв'язку в Telegram" },
  { icon: "✅", title: "Гарантія оригіналу", desc: "Всі товари з офіційних каналів постачання" },
];

export default function B2BPage() {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", volume: "", product: "", comment: ""
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Відправляємо повідомлення адміну через Telegram бот
    const BOT_TOKEN = "8644972775:AAHT94GCBd-25eFsmEFLp9Ph1JFnCpfJ7i8";
    const CHAT_ID = "455255915";
    const text = `💼 НОВА B2B ЗАЯВКА\n\n👤 ${form.name}\n🏢 ${form.company || "—"}\n📞 ${form.phone}\n📦 Об'єм: ${form.volume}\n🛢️ Товар: ${form.product || "—"}\n💬 ${form.comment || "—"}`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
    } catch {}
    setSent(true);
  };

  if (sent) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Заявку отримано!</h2>
        <p className="text-gray-400 mb-6">Ми зв'яжемося з вами протягом 2 годин</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold">
          На головну
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Оптові замовлення" }]} />

        {/* Hero */}
        <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 border border-yellow-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">💼</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Оптові замовлення</h1>
              <p className="text-yellow-300 mt-1">Для СТО, автопарків, фермерських господарств</p>
            </div>
          </div>
        </div>

        {/* Об'єми */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">🛢️ Доступні об'єми</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {VOLUMES.map(v => (
              <div key={v.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{v.icon}</div>
                <div className="font-bold text-white text-sm">{v.label}</div>
                <div className="text-gray-400 text-xs mt-1">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Переваги */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">✨ Переваги роботи з нами</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-gray-800 rounded-xl p-5">
                <div className="text-2xl mb-2">{b.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{b.title}</h3>
                <p className="text-gray-400 text-xs">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Цінова сітка */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">💰 Оптова знижка</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Сума замовлення</th>
                  <th className="text-left py-2">Знижка</th>
                  <th className="text-left py-2">Умови</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  ["від 5 000₴", "-10%", "Передоплата 50%"],
                  ["від 15 000₴", "-15%", "Передоплата 30%"],
                  ["від 50 000₴", "-20%", "Індивідуально"],
                  ["від 100 000₴", "-25%+", "VIP умови"],
                ].map(([sum, disc, cond]) => (
                  <tr key={sum} className="text-white">
                    <td className="py-3 font-medium">{sum}</td>
                    <td className="py-3 text-green-400 font-bold">{disc}</td>
                    <td className="py-3 text-gray-400">{cond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Форма */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-5">📋 Залишити заявку</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Ваше ім'я *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Іван Петренко"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Компанія / Господарство</label>
                <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  placeholder="ФГ Петренко / СТО Автосервіс"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Телефон *</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="+380XXXXXXXXX"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Потрібний об'єм</label>
                <select value={form.volume} onChange={e => setForm({...form, volume: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500">
                  <option value="">Оберіть...</option>
                  <option>20L каністра</option>
                  <option>60L бочка</option>
                  <option>208L бочка</option>
                  <option>Кілька позицій — обговоримо</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Який товар цікавить?</label>
              <input value={form.product} onChange={e => setForm({...form, product: e.target.value})}
                placeholder="Liqui Moly 5W-40 синтетика, або потрібна консультація"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Коментар</label>
              <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}
                rows={3} placeholder="Будь-яка додаткова інформація..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 resize-none" />
            </div>
            <button type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-4 rounded-xl font-bold text-lg transition">
              📩 Відправити заявку
            </button>
            <p className="text-center text-gray-500 text-xs">Відповімо протягом 2 годин в робочий час</p>
          </form>
        </div>
      </div>
    </div>
  );
}
