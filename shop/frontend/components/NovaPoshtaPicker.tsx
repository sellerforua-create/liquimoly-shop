"use client";
import { useState, useEffect, useRef } from "react";

const NP_API = "https://api.novaposhta.ua/v2.0/json/";
const NP_KEY = "920bf2c3b43a1c66dc796c7da053a450";

async function npCall(model: string, method: string, props: Record<string, any> = {}) {
  const res = await fetch(NP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: NP_KEY, modelName: model, calledMethod: method, methodProperties: props }),
  });
  const data = await res.json();
  return data.success ? data.data : [];
}

export default function NovaPoshtaPicker({
  onSelect,
}: {
  onSelect: (city: string, warehouse: string) => void;
}) {
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [showCities, setShowCities] = useState(false);

  const [whQuery, setWhQuery] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWh, setSelectedWh] = useState<any>(null);
  const [showWh, setShowWh] = useState(false);
  const [loadingWh, setLoadingWh] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const whRef = useRef<HTMLDivElement>(null);

  // Search cities
  useEffect(() => {
    if (cityQuery.length < 2) { setCities([]); return; }
    const t = setTimeout(async () => {
      const res = await npCall("AddressGeneral", "searchSettlements", {
        CityName: cityQuery, Limit: "15", Page: "1",
      });
      const addresses = res?.[0]?.Addresses || [];
      setCities(addresses);
      setShowCities(true);
    }, 300);
    return () => clearTimeout(t);
  }, [cityQuery]);

  // Load warehouses when city selected
  useEffect(() => {
    if (!selectedCity) return;
    setLoadingWh(true);
    npCall("AddressGeneral", "getWarehouses", {
      CityRef: selectedCity.DeliveryCity || selectedCity.Ref,
      Limit: "500", Page: "1",
    }).then(res => {
      setWarehouses(res || []);
      setLoadingWh(false);
    });
  }, [selectedCity]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCities(false);
      if (whRef.current && !whRef.current.contains(e.target as Node)) setShowWh(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredWh = whQuery
    ? warehouses.filter(w => w.Description.toLowerCase().includes(whQuery.toLowerCase()))
    : warehouses;

  return (
    <div className="space-y-3">
      {/* City picker */}
      <div ref={cityRef} className="relative">
        <label className="text-slate-400 text-xs mb-1 block">🏙️ Місто</label>
        <input
          value={selectedCity ? selectedCity.Present : cityQuery}
          onChange={e => {
            setCityQuery(e.target.value);
            setSelectedCity(null);
            setSelectedWh(null);
            setWarehouses([]);
            onSelect("", "");
          }}
          onFocus={() => cities.length > 0 && setShowCities(true)}
          placeholder="Почніть вводити назву міста..."
          className="input-dark text-sm w-full"
        />
        {showCities && cities.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10"
            style={{ background: "rgba(15,17,35,0.98)", backdropFilter: "blur(20px)" }}>
            {cities.map((c: any, i: number) => (
              <button key={i} type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => {
                  setSelectedCity(c);
                  setCityQuery(c.Present);
                  setShowCities(false);
                  setSelectedWh(null);
                }}>
                {c.Present}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse picker */}
      {selectedCity && (
        <div ref={whRef} className="relative">
          <label className="text-slate-400 text-xs mb-1 block">📦 Відділення Нової Пошти</label>
          <input
            value={selectedWh ? selectedWh.Description : whQuery}
            onChange={e => {
              setWhQuery(e.target.value);
              setSelectedWh(null);
              onSelect(selectedCity.Present, "");
            }}
            onFocus={() => setShowWh(true)}
            placeholder={loadingWh ? "Завантаження відділень..." : "Оберіть або введіть номер відділення..."}
            disabled={loadingWh}
            className="input-dark text-sm w-full"
          />
          {showWh && filteredWh.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-white/10"
              style={{ background: "rgba(15,17,35,0.98)", backdropFilter: "blur(20px)" }}>
              {filteredWh.slice(0, 30).map((w: any, i: number) => (
                <button key={i} type="button"
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => {
                    setSelectedWh(w);
                    setWhQuery(w.Description);
                    setShowWh(false);
                    onSelect(selectedCity.Present, w.Description);
                  }}>
                  {w.Description}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
