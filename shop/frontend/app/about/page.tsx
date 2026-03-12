export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Про нас 🛢️</h1>

        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Хто ми?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Ми — офіційний дропшиппінг партнер Liqui Moly в Україні. Продаємо оригінальну автохімію
            від одного з найкращих виробників Європи.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Більше <strong className="text-white">400 товарів</strong> у нашому каталозі:
            моторні оливи, присадки, очисники, змащення та багато іншого для вашого автомобіля.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: "✅", title: "Оригінальний товар", desc: "Тільки сертифікована продукція Liqui Moly" },
            { icon: "🚚", title: "Швидка доставка", desc: "Nova Poshta по всій Україні за 1-2 дні" },
            { icon: "💰", title: "Вигідні ціни", desc: "Без зайвих накруток — пряма поставка" },
          ].map(item => (
            <div key={item.title} className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-900 border border-blue-700 rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold mb-3">Замовляйте зручно — у нашому Telegram боті</p>
          <a href="https://t.me/Liquimolli_bot" target="_blank"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition">
            ✈️ Відкрити бота
          </a>
        </div>
      </div>
    </div>
  );
}
