export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-display font-bold text-blue-600">
            🤖 Klausur-AI
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto">
            Altklausuren mit AI-Lösungen - Lerne smarter, nicht härter
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/25">
              Klausuren durchsuchen
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-500 rounded-2xl font-semibold text-lg transition-all">
              Premium testen
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-blue-100">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-display font-bold mb-2">Altklausuren</h3>
            <p className="text-gray-600">
              Tausende Klausuren von Kommilitonen. Durchsuche nach Modul, Prof, Semester.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-blue-100">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-display font-bold mb-2">AI-Lösungen</h3>
            <p className="text-gray-600">
              Schritt-für-Schritt Erklärungen generiert von KI. Premium Feature.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-xl border border-blue-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-display font-bold mb-2">Similarity Check</h3>
            <p className="text-gray-600">
              Plagiats-Prüfung für deine Lösungen. Vermeide unbeabsichtigte Kopien.
            </p>
          </div>
        </div>

        <div className="mt-20 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl text-white text-center">
          <h2 className="text-3xl font-display font-bold mb-4">🚀 Premium für €5/Monat</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Unbegrenzte AI-Lösungen</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Schritt-für-Schritt Erklärungen</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Similarity-Check</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Priorisierter Support</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Alle Formate herunterladen</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span>Jederzeit kündbar</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
