import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <div className="text-6xl mb-6">🛢️</div>
        <h1 className="text-2xl font-bold text-white mb-3">Сторінку не знайдено</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Можливо, товар закінчився або посилання застаріло. Заходьте в каталог!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalog" className="btn-glow px-8 py-3 text-sm">🛍 Перейти в каталог</Link>
          <Link href="/" className="glass glass-hover px-8 py-3 text-sm rounded-xl text-slate-300 text-center font-semibold">🏠 На головну</Link>
        </div>
      </div>
    </div>
  );
}
