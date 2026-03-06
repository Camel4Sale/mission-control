'use client';

import { useState } from 'react';
import { Lead } from '@/types';
import { Users, Plus, Mail, Phone, MapPin, Star, CheckCircle, Clock } from 'lucide-react';

// Mock data for demonstration
const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Max Mustermann',
    email: 'max@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1, 12345 Berlin',
    latitude: 52.52,
    longitude: 13.405,
    dachflaeche: 80,
    potenzialScore: 'A',
    status: 'neu',
    notizen: ['Interesse an Premium-Paket', 'Dach wurde 2020 saniert'],
    tasks: [
      { id: 't1', title: 'Erstanruf', dueDate: new Date(), completed: false, type: 'call' }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Julia Schmidt',
    email: 'julia@example.com',
    phone: '+49 987 654321',
    address: 'Sonnenweg 5, 80331 München',
    latitude: 48.1351,
    longitude: 11.582,
    dachflaeche: 120,
    potenzialScore: 'B',
    status: 'kontaktiert',
    notizen: ['Möchte Finanzierungsoptionen'],
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const scoreColors: Record<string, string> = {
  'A': 'bg-green-500',
  'B': 'bg-lime-500',
  'C': 'bg-yellow-500',
  'D': 'bg-orange-500',
  'E': 'bg-red-400',
  'F': 'bg-red-600',
};

const statusColors: Record<string, string> = {
  'neu': 'bg-blue-100 text-blue-800',
  'kontaktiert': 'bg-yellow-100 text-yellow-800',
  'angebot': 'bg-purple-100 text-purple-800',
  'abschluss': 'bg-green-100 text-green-800',
};

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const statusCounts = {
    neu: leads.filter(l => l.status === 'neu').length,
    kontaktiert: leads.filter(l => l.status === 'kontaktiert').length,
    angebot: leads.filter(l => l.status === 'angebot').length,
    abschluss: leads.filter(l => l.status === 'abschluss').length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
                <p className="text-green-600 text-sm">{leads.length} Leads in Pipeline</p>
              </div>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Neuer Lead
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className={`p-4 rounded-xl ${statusColors[status]}`}>
              <div className="text-sm font-medium capitalize">{status}</div>
              <div className="text-3xl font-bold">{count}</div>
            </div>
          ))}
        </div>

        {/* Leads List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potenzial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      {lead.dachflaeche && (
                        <div className="text-sm text-gray-500">{lead.dachflaeche} m² Dachfläche</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {lead.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white ${scoreColors[lead.potenzialScore]}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {lead.potenzialScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {lead.tasks.filter(t => !t.completed).length} offen
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Score */}
              <div className="flex gap-4">
                <span className={`px-4 py-2 rounded-full font-medium ${statusColors[selectedLead.status]}`}>
                  Status: {selectedLead.status}
                </span>
                <span className={`px-4 py-2 rounded-full font-medium text-white ${scoreColors[selectedLead.potenzialScore]}`}>
                  Potenzial: {selectedLead.potenzialScore}
                </span>
              </div>

              {/* Kontakt */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Kontaktinformationen</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedLead.email}
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedLead.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedLead.address}
                  </div>
                </div>
              </div>

              {/* Notizen */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Notizen</h3>
                <div className="space-y-2">
                  {selectedLead.notizen.map((note, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                      {note}
                    </div>
                  ))}
                  {selectedLead.notizen.length === 0 && (
                    <p className="text-gray-500 italic">Keine Notizen</p>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tasks</h3>
                <div className="space-y-2">
                  {selectedLead.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <CheckCircle className={`w-5 h-5 ${task.completed ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={task.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Fällig: {task.dueDate.toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedLead.tasks.length === 0 && (
                    <p className="text-gray-500 italic">Keine Tasks</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Email senden
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Anrufen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
