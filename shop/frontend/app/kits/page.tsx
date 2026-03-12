"use client";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";

// Реальні ID товарів з нашої БД
const KITS = [
  {
    id: "kit-1",
    title: "Комплект для бензинового авто",
    subtitle: "Toyota, Honda, Hyundai, Kia та ін.",
    icon: "⛽",
    color: "blue",
    items: [
      { id: 208, name: "Liqui Moly Molygen 5W-30 4L", price: 3214.8, icon: "🛢️" },
      { id: 58, name: "Промивка Engine Flush 0.3L", price: 500.4, icon: "🔧" },
    ],
    extras: [
      { name: "Фільтр масляний (за моделлю)", price: 250, icon: "🔩" },
    ],
    badge: "🔥 Хіт",
    badgeColor: "bg-orange-600",
  },
  {
    id: "kit-2",
    title: "Комплект для дизельного авто",
    subtitle: "BMW, Mercedes, VW, Audi, Ford",
    icon: "🚗",
    color: "green",
    items: [
      { id: 205, name: "Liqui Moly Leichtlauf 5W-40 4L", price: 3470.4, icon: "🛢️" },
      { id: 63, name: "Промивка High Performance Diesel", price: 651.6, icon: "🔧" },
    ],
    extras: [
      { name: "Фільтр масляний (за моделлю)", price: 250, icon: "🔩" },
    ],
    badge: "⭐ Топ",
    badgeColor: "bg-yellow-600",
  },
  {
    id: "kit-3",
    title: "Економ комплект",
    subtitle: "Для старших авто 2005–2015",
    icon: "💰",
    color: "gray",
    items: [
      { id: 206, name: "Liqui Moly Special Tec LL 5W-30 4L", price: 3412.8, icon: "🛢️" },
      { id: 64, name: "Промивка Light 0.3L", price: 392.4, icon: "🔧" },
    ],
    extras: [
      { name: "Фільтр масляний (за моделлю)", price: 200, icon: "🔩" },
    ],
    badge: "💸 Бюджет",
    badgeColor: "bg-gray-600",
  },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-900 to-blue-800 border-blue-700",
  green: "from-green-900 to-green-800 border-green-700",
  gray: "from-gray-800 to-gray-700 border-gray-600",
};

export default function KitsPage() {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const handleAddKit = (kit: typeof KITS[0]) => {
    kit.items.forEach(item => {
      addItem({ id: item.id, name: item.name, price: item.price, available: true });
    });
    showToast(`✅ Комплект "${kit.title}" додано до кошика`);
    openCart();
  };

  const getTotal = (kit: typeof KITS[0]) =>
    kit.items.reduce((s, i) => s + i.price, 0);

  const getDiscount = (total: number) =>
    Math.round(total * 0.95); // 5% знижка за комплект

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Комплекти заміни масла" }]} />

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">🔧 Комплекти для заміни масла</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Всe потрібне для заміни масла в одному замовленні. Економія 5% проти покупки окремо.
          </p>
        </div>

        {/* Що входить */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">📦 Що входить в комплект заміни масла:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "🛢️", text: "Моторне масло" },
              { icon: "🔧", text: "Промивка двигуна" },
              { icon: "🔩", text: "Масляний фільтр*" },
              { icon: "💨", text: "Повітряний фільтр*" },
            ].map(i => (
              <div key={i.text} className="bg-gray-700 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{i.icon}</div>
                <p className="text-sm text-gray-300">{i.text}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3">* Фільтри підбираємо під вашу модель авто — вкажіть при замовленні</p>
        </div>

        {/* Комплекти */}
        <div className="space-y-6">
          {KITS.map(kit => {
            const total = getTotal(kit);
            const discounted = getDiscount(total);
            const save = Math.round(total - discounted);
            return (
              <div key={kit.id} className={`bg-gradient-to-r ${colorMap[kit.color]} border rounded-2xl p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{kit.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{kit.title}</h3>
                        <span className={`${kit.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                          {kit.badge}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{kit.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 line-through text-sm">{total.toFixed(0)}₴</p>
                    <p className="text-2xl font-bold text-white">{discounted}₴</p>
                    <p className="text-green-400 text-xs">економія {save}₴</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {kit.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <Link href={`/catalog/${item.id}`} className="text-sm text-white hover:underline">
                          {item.name}
                        </Link>
                      </div>
                      <span className="text-white text-sm font-medium">{item.price}₴</span>
                    </div>
                  ))}
                  {kit.extras.map(extra => (
                    <div key={extra.name} className="flex items-center justify-between bg-black/10 rounded-lg px-4 py-2 border border-dashed border-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{extra.icon}</span>
                        <span className="text-sm text-gray-400">{extra.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">~{extra.price}₴</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddKit(kit)}
                    className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 rounded-xl transition">
                    🛒 Додати комплект до кошика
                  </button>
                  <a href="https://t.me/Liquimolli_bot" target="_blank"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition text-center">
                    ✈️
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Індивідуальний підбір */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">🚗 Не знаєте що підходить вашому авто?</h2>
          <p className="text-gray-400 mb-5">Напишіть марку, модель і рік — підберемо оптимальний комплект</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/car-selector" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition">
              🔍 Підібрати по авто
            </Link>
            <a href="https://t.me/Liquimolli_bot" target="_blank"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-3 rounded-xl transition">
              ✈️ Запитати в боті
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
