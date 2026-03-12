"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";

const BRANDS: Record<string, string[]> = {
  Toyota: ["Corolla", "Camry", "RAV4", "Land Cruiser", "Yaris"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "1 Series"],
  Mercedes: ["C-Class", "E-Class", "GLC", "A-Class", "Sprinter"],
  Volkswagen: ["Golf", "Passat", "Tiguan", "Polo", "Touareg"],
  Audi: ["A4", "A6", "Q5", "Q7", "A3"],
  Ford: ["Focus", "Fiesta", "Kuga", "Mondeo", "Ranger"],
  Hyundai: ["Tucson", "i30", "Santa Fe", "Elantra", "Creta"],
  Kia: ["Sportage", "Ceed", "Sorento", "Rio", "Stinger"],
  Opel: ["Astra", "Insignia", "Mokka", "Zafira", "Corsa"],
  Nissan: ["Qashqai", "X-Trail", "Juke", "Leaf", "Micra"],
  Mazda: ["CX-5", "Mazda3", "Mazda6", "MX-5", "CX-30"],
  Skoda: ["Octavia", "Superb", "Kodiaq", "Fabia", "Karoq"],
  Renault: ["Duster", "Megane", "Clio", "Captur", "Logan"],
  Peugeot: ["308", "207", "3008", "5008", "Partner"],
};

const YEARS = ["2021+", "2016–2020", "2010–2015", "до 2010"];
const FUEL = ["Бензин", "Дизель", "Гібрид"];

function getOilQuery(brand: string, year: string, fuel: string): string {
  if (fuel === "Дизель") return "5W-40 Diesel";
  if (brand === "BMW" || brand === "Mercedes") return "5W-30 Leichtlauf";
  if (year === "2021+" || year === "2016–2020") return "5W-30";
  return "5W-40";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CarSelectorPage() {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = async () => {
    setLoading(true);
    const query = getOilQuery(brand, year, fuel);
    try {
      const r = await fetch(`${API_URL}/api/products/?search=${encodeURIComponent(query)}&limit=4`);
      const d = await r.json();
      setResults(d.items || []);
      setStep(5);
    } catch {
      setResults([]);
      setStep(5);
    }
    setLoading(false);
  };

  const oilLabel = brand && year && fuel ? getOilQuery(brand, year, fuel) : "";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: "Головна", href: "/" }, { label: "Підбір масла" }]} />
        <h1 className="text-3xl font-bold mb-2">🚗 Підбір масла</h1>
        <p className="text-gray-400 mb-8">Знайдемо оптимальне масло для вашого авто</p>

        {/* Прогрес */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${step > i ? "bg-blue-500" : step === i ? "bg-blue-700" : "bg-gray-700"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Крок 1: Оберіть марку</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(BRANDS).map(b => (
                <button key={b} onClick={() => { setBrand(b); setStep(2); }}
                  className="bg-gray-800 hover:bg-blue-700 border border-gray-700 hover:border-blue-500 rounded-xl py-3 px-2 text-sm font-medium transition">
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Крок 2: Модель <span className="text-blue-400">{brand}</span></h2>
            <div className="grid grid-cols-2 gap-3">
              {BRANDS[brand]?.map(m => (
                <button key={m} onClick={() => { setModel(m); setStep(3); }}
                  className="bg-gray-800 hover:bg-blue-700 border border-gray-700 hover:border-blue-500 rounded-xl py-3 px-4 text-sm font-medium transition text-left">
                  {m}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-500 hover:text-gray-300 text-sm">← Назад</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Крок 3: Рік випуску</h2>
            <div className="grid grid-cols-2 gap-3">
              {YEARS.map(y => (
                <button key={y} onClick={() => { setYear(y); setStep(4); }}
                  className="bg-gray-800 hover:bg-blue-700 border border-gray-700 hover:border-blue-500 rounded-xl py-4 text-sm font-medium transition">
                  {y}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-4 text-gray-500 hover:text-gray-300 text-sm">← Назад</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Крок 4: Тип палива</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {FUEL.map(f => (
                <button key={f} onClick={() => setFuel(f)}
                  className={`border rounded-xl py-4 text-sm font-medium transition ${fuel === f ? "bg-blue-600 border-blue-500" : "bg-gray-800 border-gray-700 hover:border-blue-500"}`}>
                  {f === "Бензин" ? "⛽" : f === "Дизель" ? "🛢️" : "⚡"} {f}
                </button>
              ))}
            </div>
            {fuel && (
              <button onClick={search} disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-lg transition">
                {loading ? "⏳ Шукаю..." : "🔍 Знайти масло"}
              </button>
            )}
            <button onClick={() => setStep(3)} className="mt-3 text-gray-500 hover:text-gray-300 text-sm block">← Назад</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="bg-blue-900 border border-blue-700 rounded-2xl p-5 mb-6 text-center">
              <p className="text-gray-300 text-sm mb-1">Для {brand} {model} ({year}, {fuel})</p>
              <p className="text-white font-bold text-xl">Рекомендуємо: {oilLabel}</p>
            </div>
            {results.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Підходящі товари:</h3>
                <div className="space-y-3">
                  {results.map(p => (
                    <a key={p.id} href={`/catalog/${p.id}`}
                      className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition">
                      <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain" alt="" /> : <span className="text-2xl">🛢️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-2">{p.name}</p>
                        <p className="text-blue-400 font-bold mt-1">{p.price} ₴</p>
                      </div>
                      <span className="text-gray-400 text-lg">→</span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-4">Нічого не знайдено. Спробуйте інші параметри.</p>
            )}
            <button onClick={() => { setStep(1); setBrand(""); setModel(""); setYear(""); setFuel(""); }}
              className="w-full mt-6 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm">
              🔄 Почати знову
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
