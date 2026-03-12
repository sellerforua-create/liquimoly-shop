import Link from "next/link";

const STATS = [
  { value: "485+", label: "Товарів" },
  { value: "24h", label: "Доставка" },
  { value: "100%", label: "Оригінал" },
  { value: "5★", label: "Рейтинг" },
];

const FEATURES = [
  { icon: "🇩🇪", title: "Оригінал з Німеччини", desc: "Сертифікована продукція Liqui Moly" },
  { icon: "🚚", title: "Доставка 1–2 дні", desc: "Nova Poshta по всій Україні" },
  { icon: "💳", title: "Оплата при отриманні", desc: "Накладений платіж без передоплати" },
  { icon: "🔄", title: "Повернення 14 днів", desc: "Без зайвих питань та умов" },
  { icon: "💬", title: "Підтримка 24/7", desc: "Telegram бот завжди на зв'язку" },
  { icon: "✅", title: "Гарантія якості", desc: "Офіційна гарантія виробника" },
];

const CATEGORIES = [
  { href: "/catalog?category=Синтетические масла", icon: "🛢️", label: "Синтетичні масла", count: 106 },
  { href: "/catalog?category=Трансмиссионные масла", icon: "⚙️", label: "Трансмісійні", count: 45 },
  { href: "/catalog?category=Присадки в топливо", icon: "⛽", label: "Присадки в паливо", count: 43 },
  { href: "/catalog?category=Смазки", icon: "🔧", label: "Мастила", count: 45 },
  { href: "/catalog?category=Автокосметика", icon: "✨", label: "Автокосметика", count: 34 },
  { href: "/catalog?category=Масла для мотоциклов", icon: "🏍️", label: "Мотоцикли", count: 32 },
  { href: "/agro", icon: "🚜", label: "Агротехніка", count: 20 },
  { href: "/kits", icon: "🔩", label: "Комплекти", count: 3 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="hero-bg relative overflow-hidden px-4 pt-16 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-blue-300 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Офіційна автохімія Liqui Moly · Доставка по Україні
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
            Автохімія<br />
            <span className="gradient-text">Liqui Moly</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            485 оригінальних товарів. Масла, присадки, автокосметика та агрохімія з Німеччини.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/catalog" className="btn-glow px-8 py-4 text-base">
              🛍 Перейти в каталог
            </Link>
            <Link href="/car-selector" className="glass glass-hover px-8 py-4 text-base rounded-xl text-slate-300 font-semibold text-center">
              🚗 Підібрати для авто
            </Link>
            <Link href="/b2b" className="btn-yellow px-8 py-4 text-base">
              💼 Оптові ціни
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <div key={s.label} className="glass p-4 text-center stat-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      <div className="section-divider" />

      {/* КАТЕГОРІЇ */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Категорії товарів</h2>
          <Link href="/catalog" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Всі товари →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(c => (
            <Link key={c.href} href={c.href}
              className="glass glass-hover shine p-5 text-center group cursor-pointer block">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{c.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{c.label}</div>
              <div className="text-slate-500 text-xs">{c.count} товарів</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* СПЕЦІАЛЬНІ РОЗДІЛИ */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Спеціальні пропозиції</h2>
        <div className="grid md:grid-cols-3 gap-4">

          {/* Комплекти */}
          <Link href="/kits" className="glass glass-hover shine p-6 block group">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-lg font-bold text-white mb-2">Комплекти заміни масла</h3>
            <p className="text-slate-400 text-sm mb-4">Масло + промивка + фільтр — все в одному. Економія 5%</p>
            <div className="text-blue-400 text-sm font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
              Обрати комплект <span>→</span>
            </div>
          </Link>

          {/* Агро */}
          <Link href="/agro" className="block p-6 rounded-2xl border group transition-all hover:transform hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.05))", borderColor: "rgba(16,185,129,0.2)" }}>
            <div className="text-4xl mb-3">🚜</div>
            <h3 className="text-lg font-bold text-white mb-2">Для агротехніки</h3>
            <p className="text-slate-400 text-sm mb-4">Мастила для тракторів, комбайнів, садової техніки</p>
            <div className="text-green-400 text-sm font-medium flex items-center gap-1">
              Дивитись товари <span>→</span>
            </div>
          </Link>

          {/* B2B */}
          <Link href="/b2b" className="block p-6 rounded-2xl border group transition-all hover:transform hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.05))", borderColor: "rgba(245,158,11,0.2)" }}>
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-lg font-bold text-white mb-2">Оптові замовлення</h3>
            <p className="text-slate-400 text-sm mb-4">Бочки 20L–208L для СТО та фермерів. Від -10% знижки</p>
            <div className="text-yellow-400 text-sm font-medium flex items-center gap-1">
              Отримати пропозицію <span>→</span>
            </div>
          </Link>
        </div>
      </section>

      <div className="section-divider" />

      {/* ПЕРЕВАГИ */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Чому обирають нас</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="glass p-5 shine">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* TELEGRAM CTA */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.1))", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent pointer-events-none rounded-3xl" />
          <div className="relative">
            <div className="text-5xl mb-4">✈️</div>
            <h2 className="text-3xl font-black text-white mb-3">
              Замовляйте в <span className="gradient-text">Telegram</span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              Зручніше, швидше. Каталог, пошук, кошик і підтримка — прямо в месенджері
            </p>
            <a href="https://t.me/Liquimolli_bot" target="_blank"
              className="btn-glow inline-block px-10 py-4 text-base">
              Відкрити @Liquimolli_bot
            </a>
          </div>
          {/* Decorative */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
        </div>
      </section>

    </div>
  );
}
