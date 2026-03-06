'use client';

import React, { useState } from 'react';
import { Euro, CheckCircle, Clock, XCircle, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { RentPayment, Tenant } from '@/types';

interface RentTrackerProps {
  payments: RentPayment[];
  tenants: Tenant[];
  onSyncBank: () => Promise<void>;
  onSendReminder: (paymentId: string) => Promise<void>;
  onMarkPaid: (paymentId: string) => Promise<void>;
  onExport: (format: 'excel' | 'datev') => Promise<void>;
}

export default function RentTracker({
  payments,
  tenants,
  onSyncBank,
  onSendReminder,
  onMarkPaid,
  onExport,
}: RentTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [syncing, setSyncing] = useState(false);

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === 'paid').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    overdue: payments.filter((p) => p.status === 'overdue').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSyncBank();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Euro className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Mieteingänge</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Bank synchronisieren</span>
          </button>
          <button
            onClick={() => onExport('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => onExport('datev')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>DATEV</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt</p>
              <p className="text-2xl font-bold">€ {stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Euro className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bezahlt</p>
              <p className="text-2xl font-bold text-green-600">€ {stats.paidAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausstehend</p>
              <p className="text-2xl font-bold text-yellow-600">€ {(stats.totalAmount - stats.paidAmount - stats.overdueAmount).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Überfällig</p>
              <p className="text-2xl font-bold text-red-600">€ {stats.overdueAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Alle ({stats.total})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded-lg ${filter === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Bezahlt ({stats.paid})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Ausstehend ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-lg ${filter === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Überfällig ({stats.overdue})
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mieter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Betrag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fällig am
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mahnungen
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const tenant = tenants.find((t) => t.id === payment.tenantId);
              return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unbekannt'}
                    </div>
                    <div className="text-sm text-gray-500">{tenant?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      € {payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString('de-DE')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      payment.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {payment.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.reminderCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.status !== 'paid' && (
                      <>
                        <button
                          onClick={() => onMarkPaid(payment.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Als bezahlt markieren"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onSendReminder(payment.id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                          title="Mahnung senden"
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Keine Zahlungen gefunden
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusText(status: RentPayment['status']): string {
  const mapping: Record<RentPayment['status'], string> = {
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    overdue: 'Überfällig',
    partial: 'Teilweise',
  };
  return mapping[status];
}
