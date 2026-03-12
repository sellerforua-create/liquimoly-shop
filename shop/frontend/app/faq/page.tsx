"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Як зробити замовлення?",
    a: "Оберіть товар у каталозі, натисніть «До кошика», перейдіть до оформлення. Введіть прізвище, ім'я, номер телефону — і ми зв'яжемось для підтвердження. Або замовляйте прямо через Telegram бот @Liquimolli_bot!"
  },
  {
    q: "Які способи оплати?",
    a: "Накладений платіж (оплата при отриманні на пошті), або передоплата на картку ПриватБанку / Монобанку. Для передоплати — знижка 2%."
  },
  {
    q: "Яка доставка і терміни?",
    a: "Доставляємо Nova Poshta по всій Україні. Термін — 1-2 робочих дні після підтвердження замовлення. Вартість доставки за тарифами перевізника."
  },
  {
    q: "Чи є гарантія на товар?",
    a: "Так! Вся продукція Liqui Moly — оригінальна та сертифікована. Гарантія виробника на всі товари. У разі проблем — повне повернення або заміна."
  },
  {
    q: "Як повернути товар?",
    a: "Протягом 14 днів з моменту отримання. Товар повинен бути в оригінальній упаковці та не відкритий. Напишіть нам у Telegram @Liquimolli_bot — вирішимо швидко."
  },
  {
    q: "Чому саме Liqui Moly?",
    a: "Liqui Moly — один з найкращих виробників автохімії в Європі (Німеччина). Понад 60 років досвіду. Рейтинг #1 у Німеччині та Австрії. Продукція для будь-якого автомобіля та будь-якого клімату — ідеально підходить для України."
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">FAQ ❓</h1>
        <p className="text-gray-400 mb-8">Часті запитання</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-750 transition">
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <span className={`text-blue-400 text-xl flex-shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-300 leading-relaxed border-t border-gray-700 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-blue-900 border border-blue-700 rounded-2xl p-6 text-center">
          <p className="text-gray-300 mb-3">Не знайшли відповідь?</p>
          <a href="https://t.me/Liquimolli_bot" target="_blank"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition">
            ✈️ Написати в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
