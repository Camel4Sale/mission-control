'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Shield, GraduationCap, Building, Trees, Users, TrendingUp, FileText } from 'lucide-react';
import type { LocationAnalysis, Coordinates } from '../../types';
import { analyzeLocation } from '../../services';

// ==================== COMPONENTS ====================

interface LocationAnalyzerProps {
  latitude: number;
  longitude: number;
  radius?: number;
  onAnalysisComplete?: (analysis: LocationAnalysis) => void;
}

export function LocationAnalyzer({
  latitude,
  longitude,
  radius = 1000,
  onAnalysisComplete,
}: LocationAnalyzerProps) {
  const [analysis, setAnalysis] = useState<LocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'crime' | 'education' | 'infrastructure' | 'environment' | 'demographics' | 'development'>('overview');

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeLocation({ latitude, longitude }, radius);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyse fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, radius, onAnalysisComplete]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analysiere Standort...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Standort-Analyse
        </h2>
        <p className="text-gray-600">
          {analysis.location.address}
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Gesamt-Score</p>
            <p className="text-5xl font-bold">{analysis.overallScore}/100</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 mb-1">Empfehlung</p>
            <RecommendationBadge type={analysis.investmentRecommendation} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          <TabButton
            icon={FileText}
            label="Übersicht"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            icon={Shield}
            label="Kriminalität"
            active={activeTab === 'crime'}
            onClick={() => setActiveTab('crime')}
          />
          <TabButton
            icon={GraduationCap}
            label="Bildung"
            active={activeTab === 'education'}
            onClick={() => setActiveTab('education')}
          />
          <TabButton
            icon={Building}
            label="Infrastruktur"
            active={activeTab === 'infrastructure'}
            onClick={() => setActiveTab('infrastructure')}
          />
          <TabButton
            icon={Trees}
            label="Umwelt"
            active={activeTab === 'environment'}
            onClick={() => setActiveTab('environment')}
          />
          <TabButton
            icon={Users}
            label="Demografie"
            active={activeTab === 'demographics'}
            onClick={() => setActiveTab('demographics')}
          />
          <TabButton
            icon={TrendingUp}
            label="Entwicklung"
            active={activeTab === 'development'}
            onClick={() => setActiveTab('development')}
          />
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab analysis={analysis} />}
        {activeTab === 'crime' && <CrimeTab data={analysis.crime} />}
        {activeTab === 'education' && <EducationTab data={analysis.education} />}
        {activeTab === 'infrastructure' && <InfrastructureTab data={analysis.infrastructure} />}
        {activeTab === 'environment' && <EnvironmentTab data={analysis.environment} />}
        {activeTab === 'demographics' && <DemographicsTab data={analysis.demographics} />}
        {activeTab === 'development' && <DevelopmentTab data={analysis.development} />}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={runAnalysis}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
        >
          Neu analysieren
        </button>
        <button
          onClick={() => exportToPDF(analysis)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          PDF Export
        </button>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function RecommendationBadge({ type }: { type: 'buy' | 'hold' | 'avoid' }) {
  const config = {
    buy: { bg: 'bg-green-100', text: 'text-green-800', label: 'KAUFEN' },
    hold: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'HALTEN' },
    avoid: { bg: 'bg-red-100', text: 'text-red-800', label: 'VERMEIDEN' },
  };

  const { bg, text, label } = config[type];

  return (
    <span className={`inline-block px-4 py-2 rounded-full font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}

function OverviewTab({ analysis }: { analysis: LocationAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ScoreCard
          icon={Shield}
          label="Sicherheit"
          score={analysis.crime.safetyScore}
          color="blue"
        />
        <ScoreCard
          icon={GraduationCap}
          label="Bildung"
          score={analysis.education.coverageScore}
          color="green"
        />
        <ScoreCard
          icon={Building}
          label="Infrastruktur"
          score={analysis.infrastructure.scores.overall}
          color="purple"
        />
        <ScoreCard
          icon={Trees}
          label="Umwelt"
          score={analysis.environment.environmentScore}
          color="emerald"
        />
        <ScoreCard
          icon={Users}
          label="Demografie"
          score={analysis.demographics.demographicScore}
          color="orange"
        />
        <ScoreCard
          icon={TrendingUp}
          label="Entwicklung"
          score={analysis.development.developmentScore}
          color="indigo"
        />
      </div>

      {/* Recommendation Reasons */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Investment-Empfehlung
        </h3>
        <ul className="space-y-2">
          {analysis.recommendationReasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-gray-700">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Location Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Standort-Details</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Stadtteil</dt>
              <dd className="font-medium text-gray-900">{analysis.location.district}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">PLZ</dt>
              <dd className="font-medium text-gray-900">{analysis.location.postalCode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Koordinaten</dt>
              <dd className="font-medium text-gray-900">
                {analysis.location.coordinates.latitude.toFixed(4)}, {analysis.location.coordinates.longitude.toFixed(4)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Analyse-Info</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Radius</dt>
              <dd className="font-medium text-gray-900">{analysis.radius / 1000} km</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Datum</dt>
              <dd className="font-medium text-gray-900">
                {new Date(analysis.timestamp).toLocaleDateString('de-DE')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  score,
  color,
}: {
  icon: React.ElementType;
  label: string;
  score: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-4`}>
      <Icon className="w-6 h-6 mb-2" />
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold">{score}</p>
    </div>
  );
}

function CrimeTab({ data }: { data: LocationAnalysis['crime'] }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Kriminalitäts-Statistik (Stadtteil)</h3>
          <div className="space-y-4">
            {data.district.map((stat) => (
              <div key={stat.category} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{stat.category}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{stat.count} Fälle</span>
                  <TrendIndicator trend={stat.trend} percentage={stat.trendPercentage} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Vergleich</h3>
          <div className="space-y-4">
            <ComparisonRow label="Stadtteil" value={data.district.reduce((sum, s) => sum + s.count, 0)} />
            <ComparisonRow label="Stadt" value={data.city.reduce((sum, s) => sum + s.count, 0)} />
            <ComparisonRow label="Bundesland" value={data.national.reduce((sum, s) => sum + s.count, 0)} />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Sicherheits-Score: {data.safetyScore}/100</h3>
        <p className="text-blue-700">
          {data.safetyScore >= 75 
            ? 'Sehr sichere Gegend mit unterdurchschnittlicher Kriminalitätsrate.'
            : data.safetyScore >= 50
            ? 'Durchschnittliche Sicherheit. Normale Vorsichtsmaßnahmen empfohlen.'
            : 'Erhöhte Kriminalitätsrate. Besondere Vorsicht ratsam.'}
        </p>
      </div>
    </div>
  );
}

function TrendIndicator({ trend, percentage }: { trend: string; percentage: number }) {
  const config = {
    increasing: { icon: '↑', color: 'text-red-600' },
    decreasing: { icon: '↓', color: 'text-green-600' },
    stable: { icon: '→', color: 'text-gray-600' },
  };

  const { icon, color } = config[trend as keyof typeof config];

  return (
    <span className={`text-sm font-medium ${color}`}>
      {icon} {Math.abs(percentage)}%
    </span>
  );
}

function ComparisonRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function EducationTab({ data }: { data: LocationAnalysis['education'] }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Schulen" value={data.schools.length} />
        <StatCard label="Kitas" value={data.kitas.length} />
        <StatCard label="Ø Bewertung" value={`${data.averageRating}/5`} />
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Schulen in der Nähe</h3>
        <div className="space-y-3">
          {data.schools.slice(0, 5).map((school) => (
            <div key={school.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-900">{school.name}</p>
                <p className="text-sm text-gray-600 capitalize">{school.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(school.distance / 1000).toFixed(1)} km</p>
                {school.rating && (
                  <p className="text-sm text-yellow-600">★ {school.rating.toFixed(1)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.plannedProjects.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-4">Geplante Projekte</h3>
          {data.plannedProjects.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-medium text-green-900">{project.name}</p>
              <p className="text-sm text-green-700">
                {project.type} • Fertigstellung: {new Date(project.expectedCompletion).toLocaleDateString('de-DE')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfrastructureTab({ data }: { data: LocationAnalysis['infrastructure'] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCardMini label="ÖPNV" score={data.scores.transport} />
        <ScoreCardMini label="Einkaufen" score={data.scores.shopping} />
        <ScoreCardMini label="Gesundheit" score={data.scores.health} />
        <ScoreCardMini label="Freizeit" score={data.scores.leisure} />
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Nächste Haltestelle</h3>
        {data.transport.nearestStop ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{data.transport.nearestStop.name}</p>
              <p className="text-sm text-gray-600 capitalize">{data.transport.nearestStop.type}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{(data.transport.nearestStop.distance / 1000).toFixed(1)} km</p>
              <p className="text-sm text-gray-600">
                Taktung: {data.transport.nearestStop.frequency.peak} min (HVZ)
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Keine Haltestellen gefunden</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FacilityList title="Einkaufen" facilities={data.shopping.facilities} />
        <FacilityList title="Gesundheit" facilities={data.health.facilities} />
      </div>
    </div>
  );
}

function ScoreCardMini({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{score}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function FacilityList({ title, facilities }: { title: string; facilities: any[] }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {facilities.slice(0, 5).map((facility, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-700">{facility.name}</span>
            <span className="text-gray-600">{(facility.distance / 1000).toFixed(1)} km</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnvironmentTab({ data }: { data: LocationAnalysis['environment'] }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Luftqualität</h3>
          <div className="space-y-3">
            <AirQualityRow label="PM2.5" value={data.airQuality.pm25} unit="µg/m³" />
            <AirQualityRow label="PM10" value={data.airQuality.pm10} unit="µg/m³" />
            <AirQualityRow label="NO₂" value={data.airQuality.no2} unit="µg/m³" />
            <AirQualityRow label="O₃" value={data.airQuality.o3} unit="µg/m³" />
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              AQI: <span className="font-medium">{data.airQuality.aqi}</span> - {data.airQuality.category}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Lärm-Belastung</h3>
          <div className="space-y-3">
            <NoiseRow label="Straßenverkehr" db={data.noise.traffic} />
            <NoiseRow label="Fluglärm" db={data.noise.aircraft} />
            <NoiseRow label="Schienenverkehr" db={data.noise.railway} />
            <NoiseRow label="Industrie" db={data.noise.industrial} />
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Gesamt: <span className="font-medium">{data.noise.overall} dB</span> - {data.noise.category}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Grünflächen in der Nähe</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.greenSpaces.slice(0, 6).map((space, index) => (
            <div key={index} className="bg-green-50 rounded-lg p-4">
              <p className="font-medium text-green-900">{space.name}</p>
              <p className="text-sm text-green-700 capitalize">{space.type}</p>
              <p className="text-sm text-green-600">{(space.distance / 1000).toFixed(1)} km</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AirQualityRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium text-gray-900">{value} {unit}</span>
    </div>
  );
}

function NoiseRow({ label, db }: { label: string; db: number }) {
  const color = db < 55 ? 'text-green-600' : db < 65 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-700">{label}</span>
      <span className={`font-medium ${color}`}>{db} dB</span>
    </div>
  );
}

function DemographicsTab({ data }: { data: LocationAnalysis['demographics'] }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Einwohner" value={data.population.toLocaleString()} />
        <StatCard label="Bevölkerungsdichte" value={`${data.density}/km²`} />
        <StatCard label="Ø Alter" value={data.ageDistribution.medianAge.toString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Altersverteilung</h3>
          <div className="space-y-2">
            {Object.entries(data.ageDistribution)
              .filter(([key]) => key !== 'medianAge')
              .map(([ageGroup, percentage]) => (
                <div key={ageGroup} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-16">{ageGroup}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Einkommen & Arbeit</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Ø Haushaltseinkommen</span>
              <span className="font-medium">€{data.income.averageHousehold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Median Einkommen</span>
              <span className="font-medium">€{data.income.medianHousehold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Arbeitslosenquote</span>
              <span className="font-medium">{data.employment.unemploymentRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Beschäftigungsrate</span>
              <span className="font-medium">{data.employment.employmentRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Bildungsniveau</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(data.education).map(([level, percentage]) => (
            <div key={level} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
              <p className="text-xs text-gray-600 capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-xl p-6 text-center">
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function DevelopmentTab({ data }: { data: LocationAnalysis['development'] }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Wert-Entwicklung Prognose</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-indigo-200 text-sm">Aktuell</p>
            <p className="text-2xl font-bold">€{data.valueForecast.current}/m²</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">1 Jahr</p>
            <p className="text-2xl font-bold">€{data.valueForecast.oneYear}/m²</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">3 Jahre</p>
            <p className="text-2xl font-bold">€{data.valueForecast.threeYears}/m²</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">5 Jahre</p>
            <p className="text-2xl font-bold">€{data.valueForecast.fiveYears}/m²</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-indigo-500">
          <p className="text-indigo-200">
            Ø Wachstum: <span className="font-bold text-white">{data.valueForecast.growthRate}% p.a.</span>
            {' '}({data.valueForecast.confidence} Zuversicht)
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Bauprojekte</h3>
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{project.type}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm text-gray-700 mb-2">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Investition: €{(project.investment / 1000000).toFixed(1)}M</span>
                {project.expectedCompletion && (
                  <span>Fertigstellung: {new Date(project.expectedCompletion).toLocaleDateString('de-DE')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.plans.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Stadtentwicklungspläne</h3>
          {data.plans.map((plan, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-medium text-gray-900">{plan.name}</p>
              <p className="text-sm text-gray-700 mt-1">{plan.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Zeitraum: {new Date(plan.timeframe.start).getFullYear()} - {new Date(plan.timeframe.end).getFullYear()}</span>
                <span>Budget: €{(plan.budget / 1000000).toFixed(0)}M</span>
                <span>Fläche: {plan.area} km²</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    planned: 'bg-gray-100 text-gray-800',
    approved: 'bg-blue-100 text-blue-800',
    in_construction: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  const labels: Record<string, string> = {
    planned: 'Geplant',
    approved: 'Genehmigt',
    in_construction: 'In Bau',
    completed: 'Abgeschlossen',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config[status] || config.planned}`}>
      {labels[status] || status}
    </span>
  );
}

// ==================== UTILITY FUNCTIONS ====================

async function exportToPDF(analysis: LocationAnalysis) {
  // In production, this would generate a PDF using a library like jsPDF or server-side rendering
  console.log('Exporting PDF:', analysis);
  alert('PDF Export wird vorbereitet...');
}

export default LocationAnalyzer;
