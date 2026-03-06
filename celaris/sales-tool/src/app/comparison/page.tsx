'use client';

import { useState } from 'react';
import { Competitor } from '@/types';
import { Trophy, TrendingUp, Check, Euro, Zap, Shield } from 'lucide-react';

const celarisData: Competitor = {
  name: 'Celaris',
  preisProKwp: 1500,
  garantieJahre: 25,
  leistungGarantie: 90,
};

const competitorData: Competitor[] = [
  { name: 'SolarMax', preisProKwp: 1800, garantieJahre: 20, leistungGarantie: 85 },
  { name: 'GreenEnergy', preisProKwp: 1650, garantieJahre: 22, leistungGarantie: 87 },
  { name: 'SunTech', preisProKwp: 1400, garantieJahre: 15, leistungGarantie: 80 },
];

const vorteile = [
  'Beste Preis-Leistung am Markt',
  '25 Jahre Produktgarantie',
  '90% Leistungsgarantie nach 25 Jahren',
  'Premium-Module von Tesla & SunPower',
  'Inklusive Smart-Home-Integration',
  '24/7 Monitoring-App',
  'Kostenloser Wartungsservice',
  'Finanzierung ab 0% effektivem Jahreszins',
];

export default function ComparisonPage() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(
    competitorData.map(c => c.name)
  );

  const toggleCompetitor = (name: string) => {
    setSelectedCompetitors(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vergleichs-Rechner</h1>
              <p className="text-green-600 text-sm">Warum Celaris die beste Wahl ist</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Competitor Selection */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Wettbewerber auswählen</h2>
          <div className="flex flex-wrap gap-3">
            {competitorData.map((competitor) => (
              <button
                key={competitor.name}
                onClick={() => toggleCompetitor(competitor.name)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCompetitors.includes(competitor.name)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {competitor.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Merkmal</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-green-900 bg-green-50">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      Celaris
                    </div>
                  </th>
                  {competitorData
                    .filter(c => selectedCompetitors.includes(c.name))
                    .map((competitor) => (
                      <th key={competitor.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {competitor.name}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Preis */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Euro className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Preis pro kWp</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center bg-green-50">
                    <span className="text-lg font-bold text-green-900">€{celarisData.preisProKwp}</span>
                  </td>
                  {competitorData
                    .filter(c => selectedCompetitors.includes(c.name))
                    .map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        <span className="text-lg text-gray-900">€{competitor.preisProKwp}</span>
                        {competitor.preisProKwp > celarisData.preisProKwp && (
                          <div className="text-sm text-green-600 font-medium">
                            +€{competitor.preisProKwp - celarisData.preisProKwp}
                          </div>
                        )}
                      </td>
                    ))}
                </tr>

                {/* Garantie */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Produktgarantie</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center bg-green-50">
                    <span className="text-lg font-bold text-green-900">{celarisData.garantieJahre} Jahre</span>
                  </td>
                  {competitorData
                    .filter(c => selectedCompetitors.includes(c.name))
                    .map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        <span className="text-lg text-gray-900">{competitor.garantieJahre} Jahre</span>
                        {competitor.garantieJahre < celarisData.garantieJahre && (
                          <div className="text-sm text-red-600 font-medium">
                            -{celarisData.garantieJahre - competitor.garantieJahre} Jahre
                          </div>
                        )}
                      </td>
                    ))}
                </tr>

                {/* Leistungsgarantie */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Leistungsgarantie (25 J.)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center bg-green-50">
                    <span className="text-lg font-bold text-green-900">{celarisData.leistungGarantie}%</span>
                  </td>
                  {competitorData
                    .filter(c => selectedCompetitors.includes(c.name))
                    .map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        <span className="text-lg text-gray-900">{competitor.leistungGarantie}%</span>
                        {competitor.leistungGarantie < celarisData.leistungGarantie && (
                          <div className="text-sm text-red-600 font-medium">
                            -{celarisData.leistungGarantie - competitor.leistungGarantie}%
                          </div>
                        )}
                      </td>
                    ))}
                </tr>

                {/* Einsparung bei 10 kWp */}
                <tr className="hover:bg-gray-50 bg-blue-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Einsparung bei 10 kWp</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center bg-green-100">
                    <span className="text-lg font-bold text-green-900">€{celarisData.preisProKwp * 10}</span>
                  </td>
                  {competitorData
                    .filter(c => selectedCompetitors.includes(c.name))
                    .map((competitor) => (
                      <td key={competitor.name} className="px-6 py-4 text-center">
                        <span className="text-lg text-gray-900">€{competitor.preisProKwp * 10}</span>
                        <div className="text-sm text-green-600 font-medium">
                          +€{(competitor.preisProKwp - celarisData.preisProKwp) * 10} teurer
                        </div>
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Vorteile */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Check className="w-8 h-8" />
            Warum Celaris besser ist
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {vorteile.map((vorteil, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">{vorteil}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Überzeugt? Jetzt Angebot anfordern!
            </h3>
            <p className="text-gray-600 mb-6">
              Sparen Sie bis zu €{(Math.max(...competitorData.map(c => c.preisProKwp)) - celarisData.preisProKwp) * 10} bei einer 10 kWp Anlage
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Kostenlos beraten lassen
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
