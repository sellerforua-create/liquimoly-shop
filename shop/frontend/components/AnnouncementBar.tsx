"use client";
import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const OFFERS = [
    "🚚 Безкоштовна доставка від 1500₴",
    "🎁 Промокод FIRST5 — знижка 5% на перше замовлення",
    "🛢️ 485+ оригінальних товарів Liqui Moly",
    "💼 Оптові ціни для СТО та фермерів → /b2b",
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative text-center py-2 px-8 text-xs font-medium text-white overflow-hidden"
      style={{ background: "linear-gradient(90deg, #1d4ed8, #4f46e5, #7c3aed, #1d4ed8)", backgroundSize: "200% 100%", animation: "gradientMove 6s linear infinite" }}>
      <style>{`@keyframes gradientMove { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }`}</style>
      <p className="transition-all duration-500">{OFFERS[idx]}</p>
      <button onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-base leading-none">
        ×
      </button>
    </div>
  );
}
