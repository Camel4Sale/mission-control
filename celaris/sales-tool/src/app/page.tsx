'use client';

import { useState } from 'react';
import { SolarInput, SolarCalculation } from '@/types';
import { calculateSolar } from '@/lib/solar-calculator';
import { Sun, Leaf, Euro, TrendingUp, Zap, House } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState<SolarInput>({
    dachflaeche: 50,
    ausrichtung: 'S',
    neigungswinkel: 35,
    stromverbrauch: 4000,
  });

  const [calculation, setCalculation] = useState<SolarCalculation | null>(null);
  const [gesamtKosten, setGesamtKosten] = useState(75000);

  const handleCalculate = () => {
    const result = calculateSolar(input, gesamtKosten, true);
    setCalculation(result);
  };

  const ausrichtungen = ['S', 'SO', 'O', 'NO', 'N', 'NW', 'W', 'SW'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Celaris Solar-Rechner</h1>
              <p className="text-green-600 text-sm">Ihr Weg zur energetischen Unabhängigkeit</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Eingabe */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <House className="w-5 h-5 text-green-600" />
              Ihre Dach-Daten
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dachfläche (m²)
                </label>
                <input
                  type="number"
                  value={input.dachflaeche}
                  onChange={(e) => setInput({ ...input, dachflaeche: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="10"
                  max="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ausrichtung
                </label>
                <select
                  value={input.ausrichtung}
                  onChange={(e) => setInput({ ...input, ausrichtung: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {ausrichtungen.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neigungswinkel (Grad)
                </label>
                <input
                  type="number"
                  value={input.neigungswinkel}
                  onChange={(e) => setInput({ ...input, neigungswinkel: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stromverbrauch (kWh/Jahr)
                </label>
                <input
                  type="number"
                  value={input.stromverbrauch}
                  onChange={(e) => setInput({ ...input, stromverbrauch: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1000"
                  max="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geschätzte Gesamtkosten (€)
                </label>
                <input
                  type="number"
                  value={gesamtKosten}
                  onChange={(e) => setGesamtKosten(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="10000"
                  max="200000"
                />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Berechnen
              </button>
            </div>
          </div>

          {/* Ergebnisse */}
          {calculation && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Ihr Solar-Ergebnis
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 font-medium">Max. Leistung</span>
                    <span className="text-2xl font-bold text-green-900">{calculation.maxLeistung} kWp</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-medium">Jahresertrag</span>
                    <span className="text-2xl font-bold text-blue-900">{calculation.jahresertrag.toLocaleString()} kWh</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-700 font-medium">Einsparung pro Jahr</span>
                    <span className="text-2xl font-bold text-yellow-900">€{calculation.einsparung.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">CO₂-Einsparung</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{calculation.co2Einsparung.toLocaleString()} kg/Jahr</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Amortisation</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{calculation.amortisation} Jahre</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-700 font-medium">Förderung gesamt</span>
                    <span className="text-2xl font-bold text-purple-900">€{calculation.foerderung.gesamt.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-purple-600 mt-2">
                    <div>BAFA: €{calculation.foerderung.bafa.toLocaleString()}</div>
                    <div>KfW: €{calculation.foerderung.kfw.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Netto-Investition nach Förderung</p>
                    <p className="text-3xl font-bold text-green-600">
                      €{(gesamtKosten - calculation.foerderung.gesamt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
