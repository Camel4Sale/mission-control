import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function calculateROI(purchasePrice: number, annualRent: number): number {
  return (annualRent / purchasePrice) * 100;
}

export function calculateYield(monthlyRent: number, propertyValue: number): number {
  const annualRent = monthlyRent * 12;
  return (annualRent / propertyValue) * 100;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RENTED: 'bg-green-500',
    VACANT: 'bg-yellow-500',
    RENOVATION: 'bg-orange-500',
    FOR_SALE: 'bg-blue-500',
    ACTIVE: 'bg-green-500',
    EXPIRED: 'bg-gray-500',
    TERMINATED: 'bg-red-500',
    PENDING: 'bg-yellow-500',
    PAID: 'bg-green-500',
    OVERDUE: 'bg-red-500',
    PARTIAL: 'bg-orange-500',
    LOW: 'bg-blue-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-orange-500',
    EMERGENCY: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    RENTED: 'Vermietet',
    VACANT: 'Frei',
    RENOVATION: 'In Renovierung',
    FOR_SALE: 'Zum Verkauf',
    ACTIVE: 'Aktiv',
    EXPIRED: 'Abgelaufen',
    TERMINATED: 'Beendet',
    PENDING: 'Ausstehend',
    PAID: 'Bezahlt',
    OVERDUE: 'Überfällig',
    PARTIAL: 'Teilweise',
    LOW: 'Niedrig',
    MEDIUM: 'Mittel',
    HIGH: 'Hoch',
    EMERGENCY: 'Notfall',
  };
  return labels[status] || status;
}

export function downloadCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
