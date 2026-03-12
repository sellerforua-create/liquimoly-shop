import Breadcrumbs from "../../components/Breadcrumbs";

const CONTACTS = [
  { icon: "✈️", label: "Telegram бот", value: "@Liquimolli_bot", href: "https://t.me/Liquimolli_bot" },
  { icon: "📧", label: "Email", value: "sellerforua@gmail.com", href: "mailto:sellerforua@gmail.com" },
  { icon: "🕐", label: "Графік роботи", value: "Пн–Нд, 9:00–20:00", href: null },
  { icon: "🚚", label: "Доставка", value: "Nova Poshta по всій Україні", href: null },
];

const FAQ_SHORT = [
  { q: "Як зробити замовлення?", a: "Додайте товари в кошик → оформіть або напишіть в бот @Liquimolli_bot" },
  { q: "Яка оплата?", a: "Накладений платіж Nova Poshta або карта (ПриватБанк / Моно)" },
  { q: "Чи є гарантія оригіналу?", a: "Так, ми постачаємо тільки офіційну продукцію Liqui Moly" },
  { q: "Як оптове замовлення?", a: "Заповніть форму на сторінці /b2b або напишіть нам в Telegram" },
];

export default function ContactsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Контакти" }]} />
        <h1 className="text-3xl font-black text-white mb-8">Контакти</h1>

        {/* Контакти */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {CONTACTS.map(c => (
            <div key={c.label} className="glass shine p-5 flex items-start gap-4">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{c.label}</p>
                {c.href
                  ? <a href={c.href} target="_blank" className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors">{c.value}</a>
                  : <p className="text-white font-semibold text-sm">{c.value}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Швидкі відповіді */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">❓ Швидкі відповіді</h2>
          <div className="space-y-3">
            {FAQ_SHORT.map(f => (
              <div key={f.q} className="glass p-4">
                <p className="text-white font-medium text-sm mb-1">{f.q}</p>
                <p className="text-slate-500 text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass p-8 rounded-3xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.05))", borderColor: "rgba(59,130,246,0.2)" }}>
          <div className="text-4xl mb-3">✈️</div>
          <h2 className="text-xl font-bold text-white mb-2">Найшвидший спосіб зв'язатись</h2>
          <p className="text-slate-400 text-sm mb-5">Telegram бот відповідає миттєво, 24/7</p>
          <a href="https://t.me/Liquimolli_bot" target="_blank" className="btn-glow inline-block px-10 py-3 text-sm">
            Написати @Liquimolli_bot
          </a>
        </div>
      </div>
    </div>
  );
}
