import Link from "next/link";

const features = [
  { icon: "🇩🇪", title: "Оригінальний Liqui Moly", desc: "Сертифікована продукція з Німеччини" },
  { icon: "✅", title: "Гарантія якості", desc: "Офіційна гарантія виробника" },
  { icon: "🚚", title: "Доставка 1-2 дні", desc: "Nova Poshta по всій Україні" },
  { icon: "💳", title: "Накладений платіж", desc: "Оплата при отриманні" },
  { icon: "🔄", title: "Повернення 14 днів", desc: "Без зайвих питань" },
  { icon: "💬", title: "Підтримка 24/7", desc: "Telegram бот завжди на зв'язку" },
];

const partners = [
  { name: "Liqui Moly", sub: "Офіційний партнер" },
  { name: "Nova Poshta", sub: "Доставка" },
  { name: "ПриватБанк", sub: "Оплата" },
  { name: "Monobank", sub: "Оплата" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛢️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Автохімія <span className="text-blue-400">Liqui Moly</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Оригінальна продукція з Німеччини. 485 товарів. Доставка Nova Poshta по всій Україні.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition">
            🛍 Перейти в каталог
          </Link>
          <Link href="/car-selector"
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition">
            🚗 Підібрати масло для авто
          </Link>
        </div>
      </section>

      {/* Переваги */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Чому нас обирають</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-gray-800 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-gray-400 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-blue-900 border border-blue-700 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✈️</div>
          <h2 className="text-2xl font-bold mb-2">Замовляйте в Telegram</h2>
          <p className="text-gray-300 mb-5">Зручніше, швидше, без зайвих кроків. Бот @Liquimolli_bot</p>
          <a href="https://t.me/Liquimolli_bot" target="_blank"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-xl transition">
            Відкрити бот
          </a>
        </div>
      </section>

      {/* Партнери */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-lg text-gray-500 text-center mb-6 uppercase tracking-widest text-xs">Наші партнери</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {partners.map(p => (
            <div key={p.name} className="bg-gray-800 rounded-xl px-6 py-4 text-center min-w-[120px]">
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-gray-500 text-xs">{p.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
