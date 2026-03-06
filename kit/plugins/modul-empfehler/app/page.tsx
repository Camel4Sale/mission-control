export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display font-bold text-violet-600">
            🎯 Modul-Empfehler
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
            KI-basierte Studienplanung für deinen KIT Master
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-violet-500/25">
              Empfehlungen bekommen
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-violet-600 border-2 border-violet-500 rounded-2xl font-semibold text-lg transition-all">
              Studienplan erstellen
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-violet-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-display font-bold mb-2">KI-Empfehlungen</h3>
            <p className="text-gray-600">
              Personalisierte Modulvorschläge basierend auf deinen Interessen und Zielen.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-violet-100">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-display font-bold mb-2">Pflicht-Checker</h3>
            <p className="text-gray-600">
              Behalte den Überblick über BWL 18 ECTS, VWL 6 ECTS & Co.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-violet-100">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-display font-bold mb-2">Alumni-Daten</h3>
            <p className="text-gray-600">
              Sieh dir an, welche Module erfolgreiche Absolventen gewählt haben.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-violet-600">
            Karriere-Pfade entdecken
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl shadow-lg border border-violet-100 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-display font-bold mb-2">Consulting</h3>
              <p className="text-gray-600 text-sm mb-4">
                Strategy, Operations, Business Transformation
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">MBB</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Big4</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Boutiques</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-lg border border-violet-100 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-display font-bold mb-2">Tech</h3>
              <p className="text-gray-600 text-sm mb-4">
                Software, Data Science, Machine Learning
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">FAANG</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Startups</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Unicorns</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-lg border border-violet-100 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-display font-bold mb-2">Finance</h3>
              <p className="text-gray-600 text-sm mb-4">
                Investment Banking, Private Equity, VC
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">GS</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">MS</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">PE Funds</span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl shadow-lg border border-violet-100 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-display font-bold mb-2">Industry</h3>
              <p className="text-gray-600 text-sm mb-4">
                Automotive, Manufacturing, Supply Chain
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">BMW</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Bosch</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Siemens</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 p-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl text-white text-center">
          <h2 className="text-3xl font-display font-bold mb-4">📋 Pflichtbereich-Checker</h2>
          <p className="mb-8 opacity-90">Behalte immer den Überblick über deine required ECTS</p>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1">18</div>
              <div className="text-sm opacity-80">BWL ECTS</div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
              <div className="text-xs mt-1 opacity-75">12/18 abgeschlossen</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm opacity-80">VWL ECTS</div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="text-xs mt-1 opacity-75">6/6 abgeschlossen</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm opacity-80">Tech ECTS</div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
              <div className="text-xs mt-1 opacity-75">3/12 abgeschlossen</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
              <div className="text-3xl font-bold mb-1">24</div>
              <div className="text-sm opacity-80">Thesis</div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
              <div className="text-xs mt-1 opacity-75">0/24 abgeschlossen</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
