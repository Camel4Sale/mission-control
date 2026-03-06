'use client';

import { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Euro, Calendar } from 'lucide-react';
import { Maintenance, MaintenancePriority, MaintenanceStatus } from '@prisma/client';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface MaintenanceTableProps {
  maintenances: Maintenance[];
}

export function MaintenanceTable({ maintenances }: MaintenanceTableProps) {
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<MaintenancePriority | 'ALL'>('ALL');

  const filteredMaintenances = maintenances.filter(m => {
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || m.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    total: maintenances.length,
    pending: maintenances.filter(m => m.status === 'PENDING').length,
    inProgress: maintenances.filter(m => m.status === 'IN_PROGRESS').length,
    completed: maintenances.filter(m => m.status === 'COMPLETED').length,
    emergency: maintenances.filter(m => m.priority === 'EMERGENCY' && m.status !== 'COMPLETED').length,
    totalCost: maintenances.reduce((sum, m) => sum + (m.actualCost || m.estimatedCost || 0), 0),
  };

  const priorityIcons: Record<MaintenancePriority, any> = {
    LOW: Clock,
    MEDIUM: Wrench,
    HIGH: AlertTriangle,
    EMERGENCY: AlertTriangle,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Gesamt</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Ausstehend</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">In Arbeit</p>
          <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Erledigt</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Notfälle</p>
          <p className="text-2xl font-bold text-red-500">{stats.emergency}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Gesamtkosten</p>
          <p className="text-lg font-bold text-orange-500">
            {(stats.totalCost / 1000).toFixed(1)}K€
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'ALL')}
          className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="ALL">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="IN_PROGRESS">In Arbeit</option>
          <option value="COMPLETED">Erledigt</option>
          <option value="CANCELLED">Storniert</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as MaintenancePriority | 'ALL')}
          className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="ALL">Alle Prioritäten</option>
          <option value="LOW">Niedrig</option>
          <option value="MEDIUM">Mittel</option>
          <option value="HIGH">Hoch</option>
          <option value="EMERGENCY">Notfall</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Titel</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Typ</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Priorität</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fällig</th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Kosten</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMaintenances.map((maintenance) => {
              const PriorityIcon = priorityIcons[maintenance.priority];
              const statusColor = getStatusColor(maintenance.status);
              
              return (
                <tr key={maintenance.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{maintenance.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {maintenance.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm">{maintenance.type}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <PriorityIcon className={`w-4 h-4 ${
                        maintenance.priority === 'EMERGENCY' ? 'text-red-500' :
                        maintenance.priority === 'HIGH' ? 'text-orange-500' :
                        maintenance.priority === 'MEDIUM' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <span className="text-sm">{getStatusLabel(maintenance.priority)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
                      {getStatusLabel(maintenance.status)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {maintenance.dueDate ? formatDate(maintenance.dueDate) : '-'}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Euro className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(maintenance.actualCost || maintenance.estimatedCost || 0)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredMaintenances.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Wartungen gefunden
          </div>
        )}
      </div>
    </div>
  );
}
