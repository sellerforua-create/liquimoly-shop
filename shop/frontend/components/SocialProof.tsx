"use client";
import { useState, useEffect } from "react";

export default function SocialProof({ productId }: { productId?: number }) {
  const [viewers, setViewers] = useState(0);
  const [lastOrder, setLastOrder] = useState(0);
  const [stock, setStock] = useState(0);

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    setViewers(rand(3, 17));
    setLastOrder(rand(5, 120));
    setStock(rand(3, 15));
    const interval = setInterval(() => setViewers(rand(3, 17)), 30000);
    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="flex flex-col gap-1 my-3">
      <p className="text-xs text-yellow-400">👁 {viewers} людей дивляться зараз</p>
      <p className="text-xs text-orange-400">🛒 Останнє замовлення: {lastOrder} хв тому</p>
      <p className="text-xs text-red-400">📦 Залишилось: {stock} шт</p>
    </div>
  );
}
