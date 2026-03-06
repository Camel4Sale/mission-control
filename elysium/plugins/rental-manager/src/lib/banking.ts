import { Fints } from 'fints';
import { RentPayment, BankConnection } from '@/types';

export interface BankCredentials {
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  pin: string;
  blz: string;
}

export class BankingService {
  private fintsClient: Fints | null = null;
  private connection: BankConnection | null = null;

  constructor() {
    // FinTS client initialized on connect
  }

  /**
   * Verbindung zur Bank herstellen
   */
  async connect(credentials: BankCredentials): Promise<boolean> {
    try {
      // FinTS Initialisierung
      // Hinweis: In Produktion müssen die korrekten FinTS-Server-URLs verwendet werden
      this.fintsClient = new Fints({
        url: this.getFinTsUrl(credentials.bankCode),
        bankCode: credentials.bankCode,
        username: credentials.accountNumber,
        pin: credentials.pin,
      });

      this.connection = {
        id: crypto.randomUUID(),
        bankCode: credentials.bankCode,
        accountNumber: credentials.accountNumber,
        accountHolder: credentials.accountHolder,
        blz: credentials.blz,
        lastSync: new Date(),
        status: 'active',
      };

      return true;
    } catch (error) {
      console.error('Bank connection failed:', error);
      return false;
    }
  }

  /**
   * FinTS Server URL basierend auf Bankleitzahl ermitteln
   */
  private getFinTsUrl(bankCode: string): string {
    // Bekannte FinTS URLs für deutsche Banken
    const finTsUrls: Record<string, string> = {
      // Deutsche Bank
      '10070000': 'https://hbci-pintab.deutsche-bank.de',
      '10070024': 'https://hbci-pintab.deutsche-bank.de',
      // Commerzbank
      '20040000': 'https://hbci.commerzbank.de',
      // Sparkassen (Beispiele)
      '10050000': 'https://hbci-berliner-sparkasse.de',
      // ING
      '50010517': 'https://hbci.ing.de',
      // DKB
      '12030000': 'https://hbci.dkb.de',
    };

    return finTsUrls[bankCode] || 'https://hbci-generic.de';
  }

  /**
   * Kontoauszüge abrufen
   */
  async fetchTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    if (!this.fintsClient) {
      throw new Error('Keine Bankverbindung hergestellt');
    }

    try {
      // FinTS Transaktionen abrufen
      const transactions = await this.fintsClient.getTransactions(
        startDate,
        endDate
      );

      return transactions.map((tx: any) => ({
        id: tx.id || crypto.randomUUID(),
        bookingDate: new Date(tx.bookingDate),
        valueDate: new Date(tx.valueDate),
        amount: parseFloat(tx.amount),
        currency: tx.currency || 'EUR',
        debtorName: tx.debtorName,
        debtorAccount: tx.debtorAccount,
        creditorName: tx.creditorName,
        creditorAccount: tx.creditorAccount,
        purpose: tx.purpose,
        bankCode: tx.bankCode,
        transactionCode: tx.transactionCode,
      }));
    } catch (error) {
      console.error('Fehler beim Abrufen der Transaktionen:', error);
      return [];
    }
  }

  /**
   * Automatische Mietzahlung zuordnen
   */
  async matchRentPayment(
    transaction: Transaction,
    tenants: Array<{
      id: string;
      name: string;
      expectedRent: number;
      bankAccount?: string;
    }>
  ): Promise<{ tenantId: string; confidence: number } | null> {
    // 1. Nach Namen matchen
    const nameMatch = tenants.find((t) =>
      this.nameMatches(transaction, t.name)
    );

    if (nameMatch) {
      return { tenantId: nameMatch.id, confidence: 0.9 };
    }

    // 2. Nach Betrag matchen
    const amountMatch = tenants.find(
      (t) => Math.abs(t.expectedRent - Math.abs(transaction.amount)) < 0.01
    );

    if (amountMatch) {
      return { tenantId: amountMatch.id, confidence: 0.7 };
    }

    // 3. Nach Verwendungszweck matchen (z.B. Mietnummer)
    const purposeMatch = this.extractTenantIdFromPurpose(transaction.purpose);
    if (purposeMatch && tenants.find((t) => t.id === purposeMatch)) {
      return { tenantId: purposeMatch, confidence: 0.85 };
    }

    return null;
  }

  /**
   * Prüfen ob Name zur Transaktion passt
   */
  private nameMatches(transaction: Transaction, name: string): boolean {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const debtorName = (transaction.debtorName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const creditorName = (transaction.creditorName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      debtorName.includes(normalizedName) ||
      normalizedName.includes(debtorName) ||
      creditorName.includes(normalizedName) ||
      normalizedName.includes(creditorName)
    );
  }

  /**
   * Mieter-ID aus Verwendungszweck extrahieren
   */
  private extractTenantIdFromPurpose(purpose: string): string | null {
    // Muster: Miete-12345, Wohnung-ABC, etc.
    const patterns = [
      /miete[-_]?(\w+)/i,
      /wohnung[-_]?(\w+)/i,
      /vertrag[-_]?(\w+)/i,
      /mieter[-_]?(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = purpose.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Überfällige Zahlungen identifizieren
   */
  identifyOverduePayments(
    payments: RentPayment[],
    transactions: Transaction[]
  ): RentPayment[] {
    const today = new Date();
    const overdueThreshold = 7; // Tage nach Fälligkeit

    return payments.filter((payment) => {
      if (payment.status === 'paid') return false;

      const dueDate = new Date(payment.dueDate);
      const daysOverdue = Math.floor(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return daysOverdue > overdueThreshold;
    });
  }

  /**
   * Automatische Mahnung erstellen
   */
  createReminder(
    payment: RentPayment,
    tenant: { email: string; address: any }
  ): Reminder {
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    const daysOverdue = Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: crypto.randomUUID(),
      paymentId: payment.id,
      tenantId: payment.tenantId,
      type: this.getReminderType(daysOverdue),
      subject: `Mahnung: Überfällige Mietzahlung - ${payment.id}`,
      message: this.generateReminderMessage(payment, daysOverdue),
      sentAt: undefined,
      createdAt: new Date(),
    };
  }

  private getReminderType(daysOverdue: number): 'friendly' | 'formal' | 'legal' {
    if (daysOverdue <= 14) return 'friendly';
    if (daysOverdue <= 30) return 'formal';
    return 'legal';
  }

  private generateReminderMessage(
    payment: RentPayment,
    daysOverdue: number
  ): string {
    const amount = payment.amount.toFixed(2);
    const dueDate = payment.dueDate.toLocaleDateString('de-DE');

    if (daysOverdue <= 14) {
      return `Sehr geehrte(r) Mieter(in),

wir möchten Sie freundlich daran erinnern, dass die Mietzahlung in Höhe von ${amount} EUR, fällig am ${dueDate}, noch nicht bei uns eingegangen ist.

Bitte überweisen Sie den Betrag innerhalb der nächsten 7 Tage auf unser hinterlegtes Konto.

Mit freundlichen Grüßen,
Ihre Hausverwaltung`;
    } else if (daysOverdue <= 30) {
      return `Sehr geehrte(r) Mieter(in),

trotz unserer vorherigen Erinnerung ist die Mietzahlung in Höhe von ${amount} EUR, fällig am ${dueDate}, immer noch nicht eingegangen.

Wir fordern Sie hiermit auf, den offenen Betrag innerhalb von 14 Tagen zu begleichen.

Mit freundlichen Grüßen,
Ihre Hausverwaltung`;
    } else {
      return `Sehr geehrte(r) Mieter(in),

die Mietzahlung in Höhe von ${amount} EUR ist seit dem ${dueDate} überfällig. Trotz mehrfacher Mahnungen haben Sie den Betrag nicht beglichen.

Wir fordern Sie letztmalig auf, den offenen Betrag innerhalb von 7 Tagen zu zahlen. Andernfalls sehen wir uns gezwungen, rechtliche Schritte einzuleiten.

Mit freundlichen Grüßen,
Ihre Hausverwaltung`;
    }
  }

  /**
   * Verbindung trennen
   */
  disconnect(): void {
    this.fintsClient = null;
    this.connection = null;
  }

  /**
   * Verbindungsstatus prüfen
   */
  isConnected(): boolean {
    return this.connection?.status === 'active';
  }
}

export interface Transaction {
  id: string;
  bookingDate: Date;
  valueDate: Date;
  amount: number;
  currency: string;
  debtorName?: string;
  debtorAccount?: string;
  creditorName?: string;
  creditorAccount?: string;
  purpose: string;
  bankCode?: string;
  transactionCode?: string;
}

export interface Reminder {
  id: string;
  paymentId: string;
  tenantId: string;
  type: 'friendly' | 'formal' | 'legal';
  subject: string;
  message: string;
  sentAt?: Date;
  createdAt: Date;
}
