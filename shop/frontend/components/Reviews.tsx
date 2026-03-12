"use client";
import { useState } from "react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

const INITIAL: Review[] = [
  { name: "Олексій К.", rating: 5, text: "Відмінна олива, двигун працює тихіше. Доставка за 1 день!", date: "2026-02-28" },
  { name: "Марина В.", rating: 5, text: "Замовляю вже втретє. Оригінал, ціна нижча ніж в магазині.", date: "2026-02-20" },
  { name: "Дмитро П.", rating: 4, text: "Все добре, єдине — трохи довго підтверджували замовлення.", date: "2026-02-15" },
  { name: "Ірина С.", rating: 5, text: "Супер сервіс! Менеджер відповів одразу, все пояснив.", date: "2026-02-10" },
  { name: "Андрій М.", rating: 5, text: "Liqui Moly — топ! Беру тільки тут, ціни кращі за всіх.", date: "2026-01-30" },
];

const Stars = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} onClick={() => onChange?.(i)}
        className={`text-xl ${onChange ? "cursor-pointer" : ""} ${i <= rating ? "text-yellow-400" : "text-gray-600"}`}>★</span>
    ))}
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    setReviews([{ ...form, date: new Date().toISOString().slice(0,10) }, ...reviews]);
    setForm({ name: "", text: "", rating: 5 });
    setShowForm(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Відгуки</h3>
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={Math.round(Number(avg))} />
            <span className="text-yellow-400 font-bold">{avg}</span>
            <span className="text-gray-400 text-sm">({reviews.length} відгуків)</span>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
          ✏️ Написати відгук
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-gray-800 rounded-xl p-5 mb-4 space-y-3">
          <input required placeholder="Ваше ім'я" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none" />
          <div>
            <p className="text-xs text-gray-400 mb-1">Оцінка:</p>
            <Stars rating={form.rating} onChange={r => setForm({...form, rating: r})} />
          </div>
          <textarea required placeholder="Ваш відгук..." value={form.text}
            onChange={e => setForm({...form, text: e.target.value})}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none resize-none" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold">
            Відправити
          </button>
        </form>
      )}

      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-white text-sm">{r.name}</span>
                <Stars rating={r.rating} />
              </div>
              <span className="text-gray-500 text-xs">{r.date}</span>
            </div>
            <p className="text-gray-300 text-sm">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
