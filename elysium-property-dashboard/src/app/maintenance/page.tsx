'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MaintenanceTable } from '@/components/MaintenanceTable';
import { Wrench, Plus, Filter, Download, AlertTriangle } from 'lucide-react';

const mockMaintenances: any[] = [
  {
    id: '1',
    propertyId: '1',
    type: 'REPAIR',
    priority: 'HIGH',
    status: 'COMPLETED',
    title: 'Heizungsreparatur',
    description: 'Austausch defekter Heizkörper in Wohnung 3',
    reportedBy: 'Michael Weber',
    assignedTo: 'Heizung Müller GmbH',
    estimatedCost: 1200,
    actualCost: 1150,
    scheduledDate: new Date('2025-02-05'),
    completedDate: new Date('2025-02-05'),
    dueDate: new Date('2025-02-10'),
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: null,
  },
  {
    id: '2',
    propertyId: '1',
    type: 'MAINTENANCE',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Jährliche Heizungsprüfung',
    description: 'Wartung der Zentralheizungsanlage',
    reportedBy: 'System',
    assignedTo: 'Heizung Müller GmbH',
    estimatedCost: 800,
    scheduledDate: new Date('2025-03-15'),
    dueDate: new Date('2025-03-15'),
  },
  {
    id: '3',
    propertyId: '6',
    type: 'RENOVATION',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    title: 'Komplettsanierung Altstadt Apartment',
    description: 'Boden, Küche, Bad, Elektrik',
    reportedBy: 'Owner',
    assignedTo: 'Baufix Stuttgart',
    estimatedCost: 45000,
    scheduledDate: new Date('2025-03-01'),
    dueDate: new Date('2025-05-31'),
  },
  {
    id: '4',
    propertyId: '3',
    type: 'REPAIR',
    priority: 'LOW',
    status: 'PENDING',
    title: 'Fensterdichtung tauschen',
    description: 'Undichte Stelle am Schlafzimmerfenster',
    reportedBy: 'Thomas Schmidt',
    estimatedCost: 150,
    dueDate: new Date('2025-04-01'),
  },
  {
    id: '5',
    propertyId: '4',
    type: 'INSPECTION',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Elektrik-Check',
    description: 'Regelmäßige Prüfung der Elektroanlage',
    reportedBy: 'System',
    assignedTo: 'Elektro Schmidt',
    estimatedCost: 500,
    scheduledDate: new Date('2025-03-20'),
    dueDate: new Date('2025-03-20'),
  },
  {
    id: '6',
    propertyId: '8',
    type: 'MAINTENANCE',
    priority: 'LOW',
    status: 'COMPLETED',
    title: 'Gartenpflege',
    description: 'Rückschnitt Hecke, Rasen mähen',
    reportedBy: 'Owner',
    assignedTo: 'Gartenbau Grün',
    estimatedCost: 300,
    actualCost: 280,
    completedDate: new Date('2025-02-20'),
  },
];

export default function MaintenancePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const emergencyCount = mockMaintenances.filter(
    m => m.priority === 'EMERGENCY' && m.status !== 'COMPLETED'
  ).length;
  const pendingCount = mockMaintenances.filter(m => m.status === 'PENDING').length;
  const inProgressCount = mockMaintenances.filter(m => m.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wartung & Reparaturen</h1>
            <p className="text-muted-foreground">
              Verwalte alle Maintenance-Tasks im Überblick
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Neue Wartung
            </button>
          </div>
        </div>

        {/* Alert Banners */}
        {emergencyCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-red-500">{emergencyCount} Notfall-Wartungen ausstehend!</p>
              <p className="text-sm text-red-500/70">Bitte sofort bearbeiten</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gesamt</p>
                <p className="text-2xl font-bold">{mockMaintenances.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ausstehend</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Wrench className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Arbeit</p>
                <p className="text-2xl font-bold text-orange-500">{inProgressCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notfälle</p>
                <p className="text-2xl font-bold text-red-500">{emergencyCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Table - Disabled temporarily due to type mismatch */}
        {/* <MaintenanceTable maintenances={mockMaintenances} /> */}
        <div className="text-center text-muted-foreground py-8">
          <p>Maintenance features coming soon...</p>
        </div>
      </main>

      {/* New Maintenance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Neue Wartung anlegen</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Gartenstadt Residenz</option>
                  <option>Villa Killesberg</option>
                  <option>Schwabing Loft</option>
                  <option>Neuenheimer Bürocenter</option>
                  <option>Planken Store</option>
                  <option>Altstadt Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Titel</label>
                <input
                  type="text"
                  placeholder="z.B. Heizungsreparatur"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  placeholder="Details zur Wartung..."
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Typ</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>REPAIR</option>
                    <option>MAINTENANCE</option>
                    <option>INSPECTION</option>
                    <option>RENOVATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priorität</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>EMERGENCY</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fällig am</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Geschätzte Kosten</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted"
              >
                Abbrechen
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
