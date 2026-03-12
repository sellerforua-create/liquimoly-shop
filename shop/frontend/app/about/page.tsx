import Breadcrumbs from "../../components/Breadcrumbs";

const TEAM = [
  { name: "Валерій", role: "Засновник", emoji: "👨‍💼" },
  { name: "Агент М4", role: "AI-менеджер 24/7", emoji: "🤖" },
];

const VALUES = [
  { icon: "🇩🇪", title: "Оригінальна продукція", desc: "Тільки офіційні товари Liqui Moly з Німеччини. Жодних підробок." },
  { icon: "🤝", title: "Чесні ціни", desc: "Прямі поставки без посередників — ціна нижча ніж в офлайн магазинах." },
  { icon: "🚀", title: "Швидка доставка", desc: "Nova Poshta по всій Україні. Відправляємо в день замовлення." },
  { icon: "💬", title: "Підтримка 24/7", desc: "Telegram бот і живий менеджер. Відповідаємо швидко." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Про нас" }]} />

        {/* Hero */}
        <div className="glass p-8 md:p-12 text-center mb-10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
          <div className="text-6xl mb-4">🛢️</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Про <span className="gradient-text">LiquiMoly UA</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
            Ми — команда що робить покупку автохімії простою, швидкою і вигідною для кожного українця.
          </p>
        </div>

        {/* Цінності */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {VALUES.map(v => (
            <div key={v.title} className="glass shine p-6">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="text-white font-bold mb-2">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Команда */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">👥 Наша команда</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {TEAM.map(t => (
              <div key={t.name} className="glass p-6 text-center shine">
                <div className="text-5xl mb-3">{t.emoji}</div>
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-slate-500 text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass p-8 rounded-3xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.05))", borderColor: "rgba(59,130,246,0.2)" }}>
          <h2 className="text-xl font-bold text-white mb-3">Є питання?</h2>
          <p className="text-slate-400 mb-5">Пишіть нам — відповімо швидко!</p>
          <a href="https://t.me/Liquimolli_bot" target="_blank" className="btn-glow inline-block px-8 py-3 text-sm">
            ✈️ Написати в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
