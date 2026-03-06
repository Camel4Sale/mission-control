'use client';

import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Euro, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface DashboardProps {
  properties: {
    total: number;
    occupied: number;
    vacant: number;
  };
  tenants: {
    total: number;
    active: number;
  };
  payments: {
    total: number;
    paid: number;
    overdue: number;
    pending: number;
  };
  defects: {
    open: number;
    urgent: number;
    inProgress: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'payment' | 'defect' | 'contract' | 'maintenance';
    message: string;
    timestamp: Date;
  }>;
}

export default function Dashboard({
  properties,
  tenants,
  payments,
  defects,
  recentActivity,
}: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Vermieter-Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Objekte */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Objekte</p>
              <p className="text-3xl font-bold text-gray-900">{properties.total}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-green-600">{properties.occupied} belegt</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-red-600">{properties.vacant} frei</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Mieter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mieter</p>
              <p className="text-3xl font-bold text-gray-900">{tenants.total}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-green-600">{tenants.active} aktiv</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Zahlungen */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Zahlungen</p>
              <p className="text-3xl font-bold text-gray-900">€ {payments.total.toLocaleString()}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-green-600">{payments.paid} bezahlt</span>
                <span className="text-sm text-red-600">{payments.overdue} überfällig</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Euro className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Mängel */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mängel</p>
              <p className="text-3xl font-bold text-gray-900">{defects.open}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-red-600">{defects.urgent} dringend</span>
                <span className="text-sm text-blue-600">{defects.inProgress} in Arbeit</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts und Aktivität */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zahlungsübersicht */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Zahlungsstatus</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Bezahlt</span>
              </div>
              <span className="font-semibold">{payments.paid}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">Ausstehend</span>
              </div>
              <span className="font-semibold">{payments.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Überfällig</span>
              </div>
              <span className="font-semibold">{payments.overdue}</span>
            </div>
          </div>
        </div>

        {/* Letzte Aktivitäten */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className={`p-2 rounded-full ${getActivityIconBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schnellaktionen */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Vertrag erstellen</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Mieter hinzufügen</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
            <Euro className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium">Abrechnung erstellen</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
            <Wrench className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium">Mangel melden</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'payment':
      return <Euro className="w-4 h-4 text-yellow-600" />;
    case 'defect':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'contract':
      return <FileText className="w-4 h-4 text-blue-600" />;
    case 'maintenance':
      return <Wrench className="w-4 h-4 text-orange-600" />;
    default:
      return <TrendingUp className="w-4 h-4 text-gray-600" />;
  }
}

function getActivityIconBg(type: string) {
  switch (type) {
    case 'payment':
      return 'bg-yellow-100';
    case 'defect':
      return 'bg-red-100';
    case 'contract':
      return 'bg-blue-100';
    case 'maintenance':
      return 'bg-orange-100';
    default:
      return 'bg-gray-100';
  }
}
