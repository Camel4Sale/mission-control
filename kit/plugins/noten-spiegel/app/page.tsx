export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display font-bold text-orange-600">
            📊 Noten-Spiegel
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
            Die anonyme Noten-Community für KIT Studenten
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-orange-500/25">
              Noten hochladen
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 rounded-2xl font-semibold text-lg transition-all">
              Modulschnitte ansehen
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-orange-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-display font-bold mb-2">Modulschnitte</h3>
            <p className="text-gray-600">
              Sieh dir die Durchschnittsnoten aller Module an und vergleiche Semester.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-orange-100">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-display font-bold mb-2">Rankings</h3>
            <p className="text-gray-600">
              Wer sind die Top-Performer in deinem Modul? Anonymes Ranking.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-orange-100">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-display font-bold mb-2">Dozenten</h3>
            <p className="text-gray-600">
              Bewerte Professoren und finde die besten Kurse für dich.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
