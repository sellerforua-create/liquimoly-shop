"use client";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 md:bottom-6 right-4 z-50 glass w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:-translate-y-1 rounded-xl shadow-lg"
      aria-label="Вгору">
      ↑
    </button>
  );
}
