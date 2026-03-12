"use client";
import { useState, useEffect } from "react";

export default function ExitPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exitPopupShown")) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setVisible(true);
        sessionStorage.setItem("exitPopupShown", "1");
        document.removeEventListener("mouseleave", handler);
      }
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, []);

  if (!visible) return null;

  const copy = () => {
    navigator.clipboard.writeText("FIRST5");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center px-4" onClick={() => setVisible(false)}>
      <div className="bg-gray-900 border border-blue-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-2xl font-bold text-white mb-2">Зачекайте!</h2>
        <p className="text-gray-300 mb-4">Спеціально для вас — промокод на першу покупку</p>
        <div className="bg-blue-900 border border-blue-500 rounded-xl py-4 px-6 mb-4">
          <p className="text-3xl font-mono font-bold text-blue-300 tracking-widest">FIRST5</p>
          <p className="text-blue-400 text-sm mt-1">знижка -5% на перше замовлення</p>
        </div>
        <button onClick={copy}
          className={`w-full py-3 rounded-xl font-bold mb-3 transition ${copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"}`}>
          {copied ? "✅ Скопійовано!" : "📋 Скопіювати промокод"}
        </button>
        <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-300 text-sm">
          Закрити
        </button>
      </div>
    </div>
  );
}
