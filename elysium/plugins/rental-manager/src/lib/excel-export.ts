import ExcelJS from 'exceljs';
import { RentPayment, UtilityBill, Property, Tenant } from '@/types';

export class ExcelExportService {
  private workbook: ExcelJS.Workbook;

  constructor() {
    this.workbook = new ExcelJS.Workbook();
  }

  /**
   * Mietzahlungen als Excel exportieren
   */
  async exportRentPayments(
    payments: RentPayment[],
    tenants: Tenant[]
  ): Promise<Buffer> {
    const worksheet = this.workbook.addWorksheet('Mietzahlungen');

    // Header stylen
    const headerRow = worksheet.addRow([
      'Zahlungs-ID',
      'Mieter',
      'Betrag (€)',
      'Fällig am',
      'Bezahlt am',
      'Status',
      'Mahnungen',
      'Bank-Transaktion',
    ]);

    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD0E1F7' },
    };

    // Daten hinzufügen
    payments.forEach((payment) => {
      const tenant = tenants.find((t) => t.id === payment.tenantId);
      worksheet.addRow([
        payment.id,
        tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unbekannt',
        payment.amount.toFixed(2),
        this.formatDate(payment.dueDate),
        payment.paidDate ? this.formatDate(payment.paidDate) : '-',
        this.translateStatus(payment.status),
        payment.reminderCount,
        payment.bankTransactionId || '-',
      ]);
    });

    // Spaltenbreiten anpassen
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Auto-Filter hinzufügen
    worksheet.autoFilter = 'A1:H1';

    return (await this.workbook.xlsx.writeBuffer()) as Buffer;
  }

  /**
   * Nebenkostenabrechnung als Excel exportieren
   */
  async exportUtilityBill(bill: UtilityBill, property: Property): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nebenkostenabrechnung');

    // Header
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = 'NEBENKOSTENABRECHNUNG';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Objekt-Informationen
    worksheet.addRow([]);
    worksheet.addRow(['Objekt:', property.address.street]);
    worksheet.addRow(['PLZ/Ort:', `${property.address.zip} ${property.address.city}`]);
    worksheet.addRow(['Abrechnungsjahr:', bill.year]);
    worksheet.addRow(['Zeitraum:', `${this.formatDate(bill.period.start)} - ${this.formatDate(bill.period.end)}`]);

    // Kostenübersicht
    worksheet.addRow([]);
    const costsHeader = worksheet.addRow(['Kostenart', 'Betrag (€)']);
    costsHeader.font = { bold: true };
    costsHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD0E1F7' },
    };

    bill.costs.forEach((cost) => {
      worksheet.addRow([cost.category, cost.amount.toFixed(2)]);
    });

    // Gesamtsumme
    const totalRow = worksheet.addRow(['GESAMT', bill.totalCosts.toFixed(2)]);
    totalRow.font = { bold: true };
    totalRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF4CC' },
    };

    // Mieteranteile
    worksheet.addRow([]);
    const tenantsHeader = worksheet.addRow(['Mieter-ID', 'Fläche (m²)', 'Personen', 'Anteil (€)']);
    tenantsHeader.font = { bold: true };
    tenantsHeader.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD0E1F7' },
    };

    bill.tenantAllocations.forEach((allocation) => {
      worksheet.addRow([
        allocation.tenantId,
        allocation.sqm.toFixed(2),
        allocation.persons || '-',
        allocation.totalAmount.toFixed(2),
      ]);
    });

    // Spaltenbreiten
    worksheet.columns.forEach((column, i) => {
      if (i === 0) column.width = 30;
      else column.width = 15;
    });

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }

  /**
   * Objekt-Übersicht als Excel exportieren
   */
  async exportProperties(properties: Property[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Objekte');

    const headerRow = worksheet.addRow([
      'ID',
      'Name',
      'Typ',
      'Straße',
      'PLZ',
      'Ort',
      'Fläche (m²)',
      'Zimmer',
      'Baujahr',
      'Wert (€)',
    ]);

    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD0E1F7' },
    };

    properties.forEach((property) => {
      worksheet.addRow([
        property.id,
        property.name,
        this.translateType(property.type),
        property.address.street,
        property.address.zip,
        property.address.city,
        property.details.sqm.toFixed(2),
        property.details.rooms,
        property.details.yearBuilt,
        this.getLatestValue(property.valueHistory).toFixed(2),
      ]);
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }

  /**
   * Handwerker-Übersicht als Excel exportieren
   */
  async exportCraftsmen(craftsmen: Array<{
    id: string;
    name: string;
    company: string;
    trade: string;
    phone: string;
    email: string;
    avgRating: number;
    totalCost: number;
  }>): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Handwerker');

    const headerRow = worksheet.addRow([
      'ID',
      'Name',
      'Firma',
      'Gewerk',
      'Telefon',
      'E-Mail',
      'Ø Bewertung',
      'Gesamtkosten (€)',
    ]);

    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD0E1F7' },
    };

    craftsmen.forEach((craftsman) => {
      worksheet.addRow([
        craftsman.id,
        craftsman.name,
        craftsman.company,
        craftsman.trade,
        craftsman.phone,
        craftsman.email,
        craftsman.avgRating.toFixed(1),
        craftsman.totalCost.toFixed(2),
      ]);
    });

    worksheet.columns.forEach((column) => {
      column.width = 18;
    });

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }

  /**
   * DATEV-Export für Buchhaltung
   */
  async exportDATEV(payments: RentPayment[]): Promise<string> {
    // DATEV CSV Format
    // Format: Umsatz, Konto, Gegenkonto, Betrag, Datum, Text

    let csv = 'Umsatz;Konto;Gegenkonto;Betrag;Datum;Text\n';

    payments.forEach((payment) => {
      const konto = '1200'; // Forderungen
      const gegenkonto = '1800'; // Bank
      const text = `Miete ${payment.id}`;

      csv += `${payment.amount.toFixed(2)};${konto};${gegenkonto};${this.formatDate(payment.paidDate || payment.dueDate)};${text}\n`;
    });

    return csv;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE');
  }

  private translateStatus(status: RentPayment['status']): string {
    const mapping: Record<RentPayment['status'], string> = {
      pending: 'Ausstehend',
      paid: 'Bezahlt',
      overdue: 'Überfällig',
      partial: 'Teilweise',
    };
    return mapping[status];
  }

  private translateType(type: Property['type']): string {
    const mapping: Record<Property['type'], string> = {
      wohnung: 'Wohnung',
      haus: 'Haus',
      gewerbe: 'Gewerbe',
    };
    return mapping[type];
  }

  private getLatestValue(history: Array<{ date: Date; value: number }>): number {
    if (history.length === 0) return 0;
    return history.sort((a, b) => b.date.getTime() - a.date.getTime())[0].value;
  }
}
