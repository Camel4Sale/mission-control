"use client";

import Link from "next/link";

const modules = [
  { name: "Modul-Planer", href: "/studium/planer", desc: "ECTS-Tracker & Semesterplanung" },
  { name: "Klausur-Tracker", href: "/studium/klausur-tracker", desc: "Alle Klausuren im Überblick" },
  { name: "Noten-Rechner", href: "/studium/noten-rechner", desc: "Durchschnitt berechnen" },
  { name: "Lern-Timer", href: "/studium/lern-timer", desc: "Focus Timer für Produktivität" },
  { name: "Flashcards", href: "/studium/study", desc: "Karteikarten lernen" },
  { name: "Datenbank", href: "/studium/datenbank", desc: "Notion-ähnliche Tabellen" },
  { name: "Module", href: "/studium/module", desc: "Alle KIT Module" },
  { name: "Kalender", href: "/studium/kalender", desc: "Prüfungstermine" },
];

export default function StudiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">📚 Studium</h1>
        <p className="text-gray-400 mb-8">KIT Master WiIng — Alle Tools für dein Studium</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href} className="block">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all card-hover">
                <h3 className="text-xl font-semibold text-white mb-2">{mod.name}</h3>
                <p className="text-gray-400 text-sm">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
