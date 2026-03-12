import Link from "next/link";

const LINKS = {
  "Магазин": [
    { href: "/catalog", label: "Каталог товарів" },
    { href: "/kits", label: "Комплекти заміни масла" },
    { href: "/car-selector", label: "Підбір масла по авто" },
    { href: "/agro", label: "Для агротехніки" },
    { href: "/b2b", label: "Оптові замовлення" },
  ],
  "Інформація": [
    { href: "/about", label: "Про нас" },
    { href: "/faq", label: "Часті питання" },
    { href: "/contacts", label: "Контакти" },
    { href: "/cart", label: "Кошик" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t mt-16" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(6,8,24,0.8)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-base shadow-lg shadow-blue-500/30">
                🛢️
              </div>
              <span className="font-black text-white text-xl">Liqui<span className="gradient-text">Moly</span> UA</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              Офіційна автохімія Liqui Moly в Україні. 485+ товарів, доставка Nova Poshta, оплата при отриманні.
            </p>
            <div className="flex gap-3">
              <a href="https://t.me/Liquimolli_bot" target="_blank"
                className="btn-glow px-4 py-2 text-sm flex items-center gap-2">
                ✈️ Telegram
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">{title}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Промокоди */}
        <div className="glass p-4 rounded-2xl mb-8">
          <p className="text-slate-400 text-xs text-center">
            🎁 Промокоди:&nbsp;
            <code className="text-blue-300 font-mono font-bold">LIQUI10</code> (-10%)&nbsp;·&nbsp;
            <code className="text-green-300 font-mono font-bold">FIRST5</code> (-5% перше замовлення)&nbsp;·&nbsp;
            <code className="text-yellow-300 font-mono font-bold">SALE15</code> (-15% розпродаж)
          </p>
        </div>

        {/* Divider */}
        <div className="section-divider my-0 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© 2026 LiquiMoly UA. Всі права захищені.</p>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <span>🇺🇦 Зроблено в Україні</span>
            <span>🇩🇪 Liqui Moly — офіційний партнер</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-slate-600 text-xs">Оплата:</span>
            <span className="glass px-2 py-1 text-xs text-slate-400 rounded-lg">💳 Накладений</span>
            <span className="glass px-2 py-1 text-xs text-slate-400 rounded-lg">🏦 Карта</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
