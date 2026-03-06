import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { RentalContract, Property, Tenant, UtilityBill } from '@/types';

export class PdfGenerator {
  private doc: PDFDocument;
  private font: any;
  private boldFont: any;

  constructor() {
    this.doc = PDFDocument.create();
    this.font = StandardFonts.Helvetica;
    this.boldFont = StandardFonts.HelveticaBold;
  }

  async generateRentalContract(
    contract: RentalContract,
    property: Property,
    tenants: Tenant[]
  ): Promise<Uint8Array> {
    const page = this.doc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    let y = height - 50;

    // Header
    page.drawText('MIETVERTRAG', {
      x: 50,
      y,
      size: 24,
      font: this.boldFont,
      color: rgb(0, 0, 0),
    });
    y -= 40;

    // Contract ID
    page.drawText(`Vertragsnummer: ${contract.id}`, {
      x: 50,
      y,
      size: 10,
      font: this.font,
    });
    y -= 25;

    // Property Details
    page.drawText('§1 Mietobjekt', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    const propertyText = `
Adresse: ${property.address.street}, ${property.address.zip} ${property.address.city}
Wohnfläche: ${property.details.sqm} m²
Zimmer: ${property.details.rooms}
Baujahr: ${property.details.yearBuilt}
`;
    page.drawText(propertyText.trim(), {
      x: 50,
      y,
      size: 11,
      font: this.font,
      lineHeight: 16,
    });
    y -= 60;

    // Tenant Details
    page.drawText('§2 Mieter', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    tenants.forEach((tenant) => {
      const tenantText = `${tenant.firstName} ${tenant.lastName}, ${tenant.address.street}, ${tenant.address.zip} ${tenant.address.city}`;
      page.drawText(tenantText, {
        x: 50,
        y,
        size: 11,
        font: this.font,
      });
      y -= 20;
    });
    y -= 20;

    // Rent Details
    page.drawText('§3 Mietzins', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    page.drawText(`Kaltmiete: € ${contract.rent.coldRent.toFixed(2)}`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 20;

    if (contract.rent.warmRent) {
      page.drawText(`Warmmiete: € ${contract.rent.warmRent.toFixed(2)}`, {
        x: 50,
        y,
        size: 11,
        font: this.font,
      });
      y -= 20;
    }

    page.drawText(`Kaution: € ${contract.deposit.toFixed(2)}`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 30;

    // Contract Period
    page.drawText('§4 Vertragsdauer', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    page.drawText(`Beginn: ${contract.startDate.toLocaleDateString('de-DE')}`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 20;

    if (contract.endDate) {
      page.drawText(`Ende: ${contract.endDate.toLocaleDateString('de-DE')}`, {
        x: 50,
        y,
        size: 11,
        font: this.font,
      });
      y -= 20;
    }

    page.drawText(`Kündigungsfrist: ${contract.noticePeriod} Monate`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 40;

    // Special Clauses
    if (contract.specialClauses && contract.specialClauses.length > 0) {
      page.drawText('§5 Besondere Vereinbarungen', {
        x: 50,
        y,
        size: 14,
        font: this.boldFont,
      });
      y -= 25;

      contract.specialClauses.forEach((clause) => {
        page.drawText(`• ${clause}`, {
          x: 50,
          y,
          size: 11,
          font: this.font,
        });
        y -= 18;
      });
      y -= 20;
    }

    // GDPR Notice
    page.drawText('§6 Datenschutzhinweis (DSGVO)', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    const gdprText =
      'Die Parteien stimmen zu, dass ihre personenbezogenen Daten zum Zwecke der Vertragsdurchführung gespeichert und verarbeitet werden. Die Daten werden vertraulich behandelt und nicht an Dritte weitergegeben, es sei denn, dies ist gesetzlich erforderlich.';
    page.drawText(gdprText, {
      x: 50,
      y,
      size: 10,
      font: this.font,
      lineHeight: 14,
    });
    y -= 50;

    // Signature Section
    page.drawText('Unterschriften', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 40;

    // Landlord Signature
    page.drawText('_________________________', {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    page.drawText('Vermieter', {
      x: 50,
      y: y - 15,
      size: 10,
      font: this.font,
    });

    // Tenant Signature
    page.drawText('_________________________', {
      x: 350,
      y,
      size: 11,
      font: this.font,
    });
    page.drawText('Mieter', {
      x: 350,
      y: y - 15,
      size: 10,
      font: this.font,
    });

    // Footer
    const footerY = 30;
    page.drawText(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, {
      x: 50,
      y: footerY,
      size: 9,
      font: this.font,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(`Elysium Rental Manager`, {
      x: width - 150,
      y: footerY,
      size: 9,
      font: this.font,
      color: rgb(0.5, 0.5, 0.5),
    });

    return await this.doc.save();
  }

  async generateUtilityBill(bill: UtilityBill, property: Property): Promise<Uint8Array> {
    const page = this.doc.addPage([595, 842]);
    const { width, height } = page.getSize();
    let y = height - 50;

    // Header
    page.drawText('NEBENKOSTENABRECHNUNG', {
      x: 50,
      y,
      size: 22,
      font: this.boldFont,
      color: rgb(0, 0, 0),
    });
    y -= 40;

    page.drawText(`Abrechnungs-ID: ${bill.id}`, {
      x: 50,
      y,
      size: 10,
      font: this.font,
    });
    y -= 25;

    // Property Info
    page.drawText('Objekt', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 20;

    page.drawText(`${property.address.street}`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 15;

    page.drawText(`${property.address.zip} ${property.address.city}`, {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 25;

    // Period
    page.drawText('Abrechnungszeitraum', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 20;

    page.drawText(
      `${bill.period.start.toLocaleDateString('de-DE')} - ${bill.period.end.toLocaleDateString('de-DE')}`,
      {
        x: 50,
        y,
        size: 11,
        font: this.font,
      }
    );
    y -= 30;

    // Cost Breakdown Table
    page.drawText('Kostenübersicht', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 25;

    // Table Header
    let tableY = y;
    page.drawText('Position', { x: 50, y: tableY, size: 11, font: this.boldFont });
    page.drawText('Betrag (€)', { x: 450, y: tableY, size: 11, font: this.boldFont, align: 'right' });
    tableY -= 20;

    // Costs
    bill.costs.forEach((cost) => {
      page.drawText(cost.category, { x: 50, y: tableY, size: 11, font: this.font });
      page.drawText(cost.amount.toFixed(2), {
        x: 450,
        y: tableY,
        size: 11,
        font: this.font,
      });
      tableY -= 18;
    });

    tableY -= 10;

    // Total
    page.drawText('GESAMT', { x: 50, y: tableY, size: 12, font: this.boldFont });
    page.drawText(bill.totalCosts.toFixed(2), {
      x: 450,
      y: tableY,
      size: 12,
      font: this.boldFont,
    });
    y = tableY - 40;

    // Distribution Key
    page.drawText('Verteilerschlüssel', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 20;

    const distributionText = {
      sqm: 'Nach Wohnfläche (m²)',
      persons: 'Nach Personenanzahl',
      consumption: 'Nach Verbrauch',
      mixed: 'Kombinierter Schlüssel',
    };
    page.drawText(distributionText[bill.distributionKey], {
      x: 50,
      y,
      size: 11,
      font: this.font,
    });
    y -= 30;

    // Tenant Allocations
    page.drawText('Mieteranteile', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 20;

    bill.tenantAllocations.forEach((allocation) => {
      page.drawText(`Mieter ID: ${allocation.tenantId}`, {
        x: 50,
        y,
        size: 11,
        font: this.font,
      });
      y -= 15;
      page.drawText(`Anteil: € ${allocation.totalAmount.toFixed(2)}`, {
        x: 70,
        y,
        size: 10,
        font: this.font,
      });
      y -= 25;
    });
    y -= 30;

    // Legal Notice
    page.drawText('Rechtsbehelf', {
      x: 50,
      y,
      size: 14,
      font: this.boldFont,
    });
    y -= 20;

    const legalText =
      'Gegen diese Abrechnung kann innerhalb von 12 Monaten nach Erhalt Widerspruch eingelegt werden. Bitte wenden Sie sich bei Fragen an die Verwaltung.';
    page.drawText(legalText, {
      x: 50,
      y,
      size: 10,
      font: this.font,
      lineHeight: 14,
    });

    // Footer
    const footerY = 30;
    page.drawText(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, {
      x: 50,
      y: footerY,
      size: 9,
      font: this.font,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(`Elysium Rental Manager`, {
      x: width - 150,
      y: footerY,
      size: 9,
      font: this.font,
      color: rgb(0.5, 0.5, 0.5),
    });

    return await this.doc.save();
  }
}
