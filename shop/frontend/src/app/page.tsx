import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Автохимия <span className="text-blue-400">Liqui Moly</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-xl">
          Оригинальные масла и автохимия с доставкой по Украине. 
          Более 400 товаров в наличии.
        </p>
        <Link
          href="/catalog"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
        >
          Перейти в каталог →
        </Link>
      </section>

      {/* Преимущества */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 pb-20">
        {[
          { icon: "🚚", title: "Быстрая доставка", desc: "По всей Украине от 1-2 дней" },
          { icon: "✅", title: "Оригинальный товар", desc: "Только сертифицированная продукция" },
          { icon: "🛡️", title: "Гарантия качества", desc: "Возврат если не подошло" },
        ].map((item) => (
          <div key={item.title} className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
