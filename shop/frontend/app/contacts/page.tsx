export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Контакти 📞</h1>

        <div className="space-y-4">
          <a href="https://t.me/Liquimolli_bot" target="_blank"
            className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition">
            <span className="text-3xl">✈️</span>
            <div>
              <p className="font-semibold text-lg">Telegram бот</p>
              <p className="text-blue-400">@Liquimolli_bot</p>
              <p className="text-gray-400 text-sm">Замовлення, питання, підтримка</p>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-gray-800 rounded-2xl p-6">
            <span className="text-3xl">🕐</span>
            <div>
              <p className="font-semibold text-lg">Графік роботи</p>
              <p className="text-gray-300">Цілодобово, 7 днів на тиждень</p>
              <p className="text-gray-400 text-sm">Бот приймає замовлення 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-800 rounded-2xl p-6">
            <span className="text-3xl">🚚</span>
            <div>
              <p className="font-semibold text-lg">Доставка</p>
              <p className="text-gray-300">Nova Poshta по всій Україні</p>
              <p className="text-gray-400 text-sm">1-2 дні після підтвердження замовлення</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-800 rounded-2xl p-6">
            <span className="text-3xl">💳</span>
            <div>
              <p className="font-semibold text-lg">Оплата</p>
              <p className="text-gray-300">Накладений платіж або передоплата</p>
              <p className="text-gray-400 text-sm">Monobank, ПриватБанк, готівка на пошті</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
