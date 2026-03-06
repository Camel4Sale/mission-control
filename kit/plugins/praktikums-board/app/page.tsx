export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display font-bold text-emerald-600">
            💼 Praktikums-Board
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
            Finde dein Traumpraktikum mit AI-Matching
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/25">
              Stellen entdecken
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-500 rounded-2xl font-semibold text-lg transition-all">
              Profil erstellen
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-emerald-100">
            <h2 className="text-3xl font-display font-bold mb-6 text-emerald-600">
              👨‍💻 Für Studenten
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>AI-Matching mit deinem Profil</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Gehalts-Transparenz bei allen Jobs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>AI-generierte Anschreiben</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Interview-Prep mit KI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Kostenlos für immer</span>
              </li>
            </ul>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-emerald-100">
            <h2 className="text-3xl font-display font-bold mb-6 text-emerald-600">
              🏢 Für Firmen
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Gezielte KIT-Talente finden</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>AI-gestütztes Matching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Erst bei Erfolg zahlen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Transparente Provision</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✓</span>
                <span>Employer Branding Profil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-emerald-600">
            Top Karriere-Pfade
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl text-white">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-display font-bold mb-2">Tech</h3>
              <p className="opacity-90 mb-4">Software Engineer, Data Scientist, ML Engineer</p>
              <div className="text-3xl font-bold">€70-95k</div>
              <p className="text-sm opacity-75">Durchschnittsgehalt</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl text-white">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-display font-bold mb-2">Consulting</h3>
              <p className="opacity-90 mb-4">Strategy, Operations, Business Analyst</p>
              <div className="text-3xl font-bold">€65-85k</div>
              <p className="text-sm opacity-75">Durchschnittsgehalt</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl text-white">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-display font-bold mb-2">Finance</h3>
              <p className="opacity-90 mb-4">Investment Banking, PE, VC</p>
              <div className="text-3xl font-bold">€80-120k</div>
              <p className="text-sm opacity-75">Durchschnittsgehalt</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
