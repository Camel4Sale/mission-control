'use client';

import { ReferenceProject } from '@/types';
import { Sun, Leaf, Home, Quote } from 'lucide-react';

const referenceProjects: ReferenceProject[] = [
  {
    id: '1',
    title: 'Familienhaus Müller',
    location: 'Berlin',
    imageBefore: '/images/ref1-before.jpg',
    imageAfter: '/images/ref1-after.jpg',
    leistung: 12.5,
    co2Gespart: 4800,
    kundeName: 'Thomas Müller',
    testimonial: 'Die Anlage von Celaris übertrifft alle Erwartungen. Unsere Stromrechnung ist um 85% gesunken!',
    completedAt: new Date('2024-06-15'),
  },
  {
    id: '2',
    title: 'Villa Schmidt',
    location: 'München',
    imageBefore: '/images/ref2-before.jpg',
    imageAfter: '/images/ref2-after.jpg',
    leistung: 18.2,
    co2Gespart: 7200,
    kundeName: 'Maria Schmidt',
    testimonial: 'Professionelle Beratung, schnelle Installation und top Service. Absolut empfehlenswert!',
    completedAt: new Date('2024-08-20'),
  },
  {
    id: '3',
    title: 'Gewerbebau Weber',
    location: 'Hamburg',
    imageBefore: '/images/ref3-before.jpg',
    imageAfter: '/images/ref3-after.jpg',
    leistung: 45.0,
    co2Gespart: 18500,
    kundeName: 'Weber GmbH',
    testimonial: 'Als Unternehmen war uns Nachhaltigkeit wichtig. Celaris hat uns perfekt beraten.',
    completedAt: new Date('2024-09-10'),
  },
  {
    id: '4',
    title: 'Eigenheim Fischer',
    location: 'Stuttgart',
    imageBefore: '/images/ref4-before.jpg',
    imageAfter: '/images/ref4-after.jpg',
    leistung: 9.8,
    co2Gespart: 3900,
    kundeName: 'Andreas Fischer',
    testimonial: 'Von der ersten Beratung bis zur Inbetriebnahme alles perfekt. Danke Celaris!',
    completedAt: new Date('2024-10-05'),
  },
];

const stats = {
  gesamtLeistung: referenceProjects.reduce((sum, p) => sum + p.leistung, 0),
  gesamtCO2: referenceProjects.reduce((sum, p) => p.co2Gespart, 0),
  anzahlProjekte: referenceProjects.length,
};

export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Referenz-Projekte</h1>
              <p className="text-green-600 text-sm">Echte Installationen, echte Kunden</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-8 h-8" />
              <span className="text-lg font-medium">Installierte Leistung</span>
            </div>
            <div className="text-4xl font-bold">{stats.gesamtLeistung.toFixed(1)} kWp</div>
            <div className="text-green-100 mt-2">in {stats.anzahlProjekte} Projekten</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Leaf className="w-8 h-8" />
              <span className="text-lg font-medium">CO₂ eingespart</span>
            </div>
            <div className="text-4xl font-bold">{stats.gesamtCO2.toLocaleString()} kg</div>
            <div className="text-blue-100 mt-2">pro Jahr</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Home className="w-8 h-8" />
              <span className="text-lg font-medium">Zufriedene Kunden</span>
            </div>
            <div className="text-4xl font-bold">{stats.anzahlProjekte}+</div>
            <div className="text-yellow-100 mt-2">in ganz Deutschland</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {referenceProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Before/After Images Placeholder */}
              <div className="grid grid-cols-2">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Vorher</div>
                    <Home className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                </div>
                <div className="bg-green-100 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-green-600 mb-1">Nachher</div>
                    <Sun className="w-12 h-12 text-green-500 mx-auto" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <p className="text-gray-600">{project.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Abgeschlossen</div>
                    <div className="font-medium text-gray-900">
                      {project.completedAt.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-700">Leistung</div>
                    <div className="text-xl font-bold text-green-900">{project.leistung} kWp</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-700">CO₂-Einsparung</div>
                    <div className="text-xl font-bold text-blue-900">{project.co2Gespart.toLocaleString()} kg/Jahr</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 italic mb-2">&quot;{project.testimonial}&quot;</p>
                      <p className="text-sm font-semibold text-gray-900">— {project.kundeName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Wird Ihr Projekt das nächste Referenzobjekt?</h2>
            <p className="text-green-100 mb-6 text-lg">
              Lassen Sie sich kostenlos beraten und starten Sie Ihre Solar-Reise
            </p>
            <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors">
              Jetzt Angebot anfordern
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
