"use client";

import Link from "next/link";

const docs = [
  { name: "Notizen", href: "/docs/notizen", desc: "Dein persönliches Wiki" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">📖 Dokumentation</h1>
        <p className="text-gray-400 mb-8">Wissen & Notizen organisieren</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Link key={doc.href} href={doc.href} className="block">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all card-hover">
                <h3 className="text-xl font-semibold text-white mb-2">{doc.name}</h3>
                <p className="text-gray-400 text-sm">{doc.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
