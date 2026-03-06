export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display font-bold text-pink-500">
            💕 Lerngruppen-Matcher
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
            Tinder für Kommilitonen - Finde deine perfekte Lerngruppe
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-pink-500/25">
              Profil erstellen
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-500 rounded-2xl font-semibold text-lg transition-all">
              Matches entdecken
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-display font-bold mb-2">Smart Matching</h3>
            <p className="text-gray-600">
              Wir matchen dich basierend auf Modul, Notenschnitt und Verfügbarkeit.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-display font-bold mb-2">Discord Chat</h3>
            <p className="text-gray-600">
              Automatische Discord Channels für deine Lerngruppen.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-display font-bold mb-2">Termine finden</h3>
            <p className="text-gray-600">
              Automatische Zeitplanung basierend auf allen Verfügbarkeiten.
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-pink-600">
            So funktioniert's
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                1️⃣
              </div>
              <h3 className="font-bold mb-2">Profil erstellen</h3>
              <p className="text-gray-600 text-sm">
                Module, Notenschnitt, Verfügbarkeit angeben
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                2️⃣
              </div>
              <h3 className="font-bold mb-2">Swipen</h3>
              <p className="text-gray-600 text-sm">
                Profile liken oder disliken
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                3️⃣
              </div>
              <h3 className="font-bold mb-2">Matchen</h3>
              <p className="text-gray-600 text-sm">
                Bei gegenseitigem Like → Match!
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                4️⃣
              </div>
              <h3 className="font-bold mb-2">Lernen</h3>
              <p className="text-gray-600 text-sm">
                Discord Channel erstellen & loslegen
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
