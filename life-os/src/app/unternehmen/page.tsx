"use client";

import Link from "next/link";

const companies = [
  { name: "Celaris", href: "/unternehmen/celaris", desc: "Solar Energy Solutions", color: "from-amber-500 to-orange-500" },
  { name: "Elysium", href: "/unternehmen/elysium", desc: "Real Estate Investment", color: "from-purple-500 to-pink-500" },
  { name: "Pathium", href: "/unternehmen/pathium", desc: "Software Development", color: "from-blue-500 to-cyan-500" },
];

export default function UnternehmenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">🏢 Unternehmen</h1>
        <p className="text-gray-400 mb-8">Deine Business-Portfolio Übersicht</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link key={company.href} href={company.href} className="block">
              <div className={`bg-gradient-to-br ${company.color} rounded-xl p-6 hover:scale-105 transition-transform`}>
                <h3 className="text-2xl font-bold text-white mb-2">{company.name}</h3>
                <p className="text-white/80 text-sm">{company.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
