// ============================================
// LIFE OS - Mock Data API
// ============================================
import { 
  Task, CalendarEvent, Area, Status,
  Module, Exam, ThesisPhase,
  Sprint, JiraTicket, DevOpsMetrics, Financials, ProductMetrics, SupportTicket,
  SalesLead, SupplyOrder, InstallationProject, SolarFinancials,
  DealPipeline, RenovationPhase, Handyman, MarketingTracker, PortfolioFinance,
  HealthStatus,
  CompanyContact, Company, Activity, Invoice, Transaction, FinancialSummary,
  Project, Milestone, Document, TeamMember, TeamTask
} from '@/types';

// ---------- Helper Functions ----------
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// ---------- Health Check API ----------
export const fetchHealthStatus = async (): Promise<HealthStatus[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { area: 'kit', status: 'green', message: 'Klausuren gut im Plan', metrics: { nextExam: 14, passed: 8, avgGrade: 1.7 } },
    { area: 'pathium', status: 'green', message: 'Sprint 12 von 12 Tickets abgeschlossen', metrics: { velocity: 42, uptime: 99.9 } },
    { area: 'celaris', status: 'yellow', message: '2 Lieferungen verzögert', metrics: { pendingOrders: 5, installations: 12 } },
    { area: 'elysium', status: 'green', message: 'Deal #47 im Notar', metrics: { activeDeals: 3, profitMTD: 45000 } },
  ];
};

// ---------- Tasks API ----------
export const fetchTasks = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: '1', title: 'Masterarbeit: Literaturrecherche abschließen', status: 'in-progress', priority: 'high', area: 'kit', dueDate: randomDate(7), createdAt: '2026-03-01', updatedAt: '2026-03-03' },
    { id: '2', title: 'Pathium: API-Endpoint für Billing implementieren', status: 'todo', priority: 'urgent', area: 'pathium', dueDate: randomDate(2), createdAt: '2026-03-02', updatedAt: '2026-03-03' },
    { id: '3', title: 'Celaris: Angebot für SolarPro GmbH erstellen', status: 'in-progress', priority: 'high', area: 'celaris', dueDate: randomDate(1), createdAt: '2026-03-01', updatedAt: '2026-03-03' },
    { id: '4', title: 'Elysium: Besichtigung Obj. Kassel', status: 'todo', priority: 'medium', area: 'elysium', dueDate: randomDate(3), createdAt: '2026-03-02', updatedAt: '2026-03-03' },
    { id: '5', title: 'KIT: Übungblatt 5 Analysis', status: 'done', priority: 'low', area: 'kit', createdAt: '2026-02-28', updatedAt: '2026-03-01' },
    { id: '6', title: 'Pathium: Bugfix Login-Token', status: 'done', priority: 'critical', area: 'pathium', createdAt: '2026-03-01', updatedAt: '2026-03-02' },
    { id: '7', title: 'Elysium: Sanierungsangebot Dachdecker', status: 'backlog', priority: 'medium', area: 'elysium', createdAt: '2026-03-03', updatedAt: '2026-03-03' },
    { id: '8', title: 'Celaris: Q1 Report erstellen', status: 'backlog', priority: 'medium', area: 'celaris', dueDate: randomDate(10), createdAt: '2026-03-03', updatedAt: '2026-03-03' },
  ];
};

// ---------- Calendar Events API ----------
export const fetchCalendarEvents = async (): Promise<CalendarEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    { id: '1', title: 'Analysis II Vorlesung', area: 'kit', type: 'lecture', start: '2026-03-04T09:45:00', end: '2026-03-04T11:15:00', location: 'HS a.F., Geb. 20.40' },
    { id: '2', title: 'Klausur: Statistik', area: 'kit', type: 'exam', start: '2026-03-17T09:00:00', end: '2026-03-17T11:00:00', location: 'Aula' },
    { id: '3', title: 'Sprint Review Pathium', area: 'pathium', type: 'sprint', start: '2026-03-05T14:00:00', end: '2026-03-05T15:00:00' },
    { id: '4', title: 'Kundmeeting Celaris - SolarPro', area: 'celaris', type: 'meeting', start: '2026-03-06T10:00:00', end: '2026-03-06T11:00:00' },
    { id: '5', title: 'Besichtigung Elysium Obj. #47', area: 'elysium', type: 'inspection', start: '2026-03-07T14:00:00', location: 'Kassel, Hauptstr. 12' },
    { id: '6', title: 'Deadlines Masterarbeit', area: 'kit', type: 'deadline', start: '2026-03-31T23:59:00' },
    { id: '7', title: 'Lieferung Solarpaneele', area: 'celaris', type: 'delivery', start: '2026-03-10T08:00:00' },
    { id: '8', title: 'Notartermin Elysium #47', area: 'elysium', type: 'milestone', start: '2026-03-20T10:00:00', location: 'Notariat Müller' },
  ];
};

// ---------- KIT APIs ----------
export const fetchModules = async (): Promise<Module[]> => {
  return [
    { id: '1', name: 'Analysis II', code: 'MATHDO', ects: 8, grade: 1.3, semester: 1, category: 'pflicht', status: 'passed' },
    { id: '2', name: 'Statistik', code: 'WIWI', ects: 6, grade: 1.7, semester: 1, category: 'pflicht', status: 'passed' },
    { id: '3', name: 'Operations Research', code: 'WIWI', ects: 6, semester: 2, category: 'pflicht', status: 'registered' },
    { id: '4', name: 'Produktion & Logistik', code: 'WIWI', ects: 8, semester: 2, category: 'wahlpflicht-wiwi', status: 'registered' },
    { id: '5', name: 'Machine Learning', code: 'INF', ects: 6, semester: 3, category: 'wahlpflicht-ing', status: 'upcoming' },
    { id: '6', name: 'Sustainable Energy Systems', code: 'ETIT', ects: 6, semester: 3, category: 'wahlpflicht-ing', status: 'upcoming' },
  ];
};

export const fetchExams = async (): Promise<Exam[]> => {
  return [
    { id: '1', moduleId: '3', date: '2026-03-17', preparationProgress: 65, oldExamsCompleted: 4, totalOldExams: 8, exercisesCompleted: 7, totalExercises: 10 },
    { id: '2', moduleId: '4', date: '2026-03-24', preparationProgress: 40, oldExamsCompleted: 2, totalOldExams: 6, exercisesCompleted: 5, totalExercises: 12 },
  ];
};

export const fetchThesisPhases = async (): Promise<ThesisPhase[]> => {
  return [
    { id: '1', title: 'Themenfindung', status: 'completed', endDate: '2026-01-15' },
    { id: '2', title: 'Exposé', status: 'completed', endDate: '2026-02-01' },
    { id: '3', title: 'Literaturrecherche', status: 'in-progress', startDate: '2026-02-02' },
    { id: '4', title: 'Datenerhebung', status: 'not-started' },
    { id: '5', title: 'Programmierung', status: 'not-started' },
    { id: '6', title: 'Schreiben', status: 'not-started' },
    { id: '7', title: 'Korrektur', status: 'not-started' },
  ];
};

// ---------- Pathium APIs ----------
export const fetchSprint = async (): Promise<Sprint> => {
  return {
    id: 'sprint-12',
    name: 'Sprint 12 - Billing Features',
    startDate: '2026-03-01',
    endDate: '2026-03-14',
    velocity: 42,
    storyPointsCompleted: 34,
    storyPointsTotal: 42,
    status: 'active',
  };
};

export const fetchJiraTickets = async (): Promise<JiraTicket[]> => {
  return [
    { id: '1', key: 'PATH-142', title: 'API Endpoint für Billing erstellen', status: 'in-progress', priority: 'high', assignee: 'Molty', storyPoints: 8 },
    { id: '2', key: 'PATH-143', title: 'Login-Token Bug fixen', status: 'blocked', priority: 'critical', assignee: 'Dev1' },
    { id: '3', key: 'PATH-144', title: 'Dashboard Charts implementieren', status: 'todo', priority: 'medium', storyPoints: 5 },
    { id: '4', key: 'PATH-145', title: 'User Settings Page', status: 'review', priority: 'low', storyPoints: 3 },
    { id: '5', key: 'PATH-146', title: 'Email Notification Service', status: 'todo', priority: 'medium', storyPoints: 8 },
  ];
};

export const fetchDevOpsMetrics = async (): Promise<DevOpsMetrics> => {
  return {
    dbLoad: 34,
    apiLatency: 45,
    uptime: 99.92,
    errorRate: 0.02,
    activeServers: 8,
  };
};

export const fetchPathiumFinancials = async (): Promise<Financials> => {
  return {
    mrr: 24500,
    mrrGrowth: 12.5,
    churnRate: 2.1,
    cloudCosts: 1840,
    awsCosts: 1240,
    vercelCosts: 600,
  };
};

export const fetchProductMetrics = async (): Promise<ProductMetrics> => {
  return {
    dau: 1247,
    mau: 8934,
    conversionRate: 4.2,
    newUsers: 156,
    activeUsersChange: 8.3,
  };
};

export const fetchSupportTickets = async (): Promise<SupportTicket[]> => {
  return [
    { id: '1', title: 'Login funktioniert nicht', priority: 'critical', status: 'open', customer: 'Acme Corp', createdAt: '2026-03-03T08:00:00', responseTime: 2 },
    { id: '2', title: 'API Rate Limit zu niedrig', priority: 'high', status: 'in-progress', customer: 'TechStart', createdAt: '2026-03-02T14:00:00', responseTime: 4 },
    { id: '3', title: 'Feature Request: Dark Mode', priority: 'low', status: 'open', customer: 'DesignCo', createdAt: '2026-03-01T10:00:00' },
  ];
};

// ---------- Celaris APIs ----------
export const fetchSalesLeads = async (): Promise<SalesLead[]> => {
  return [
    { id: '1', name: 'SolarPro GmbH', company: 'SolarPro GmbH', stage: 'negotiation', value: 45000, probability: 70, createdAt: '2026-02-15', expectedClose: '2026-03-20' },
    { id: '2', name: 'Fam. Müller', stage: 'offer-sent', value: 28000, probability: 50, createdAt: '2026-02-20' },
    { id: '3', name: 'Gewerbebau AG', company: 'Gewerbebau AG', stage: 'first-contact', value: 120000, probability: 20, createdAt: '2026-03-01' },
    { id: '4', name: 'Fam. Schmidt', stage: 'contract', value: 32000, probability: 95, createdAt: '2026-01-10', expectedClose: '2026-03-10' },
    { id: '5', name: 'Bieter Energie', company: 'Bieter Energie', stage: 'won', value: 85000, probability: 100, createdAt: '2025-12-01' },
  ];
};

export const fetchSupplyOrders = async (): Promise<SupplyOrder[]> => {
  return [
    { id: '1', supplier: 'SolarWorld AG', items: [{ name: 'Solarmodule 400W', quantity: 50, price: 12500 }], status: 'shipped', expectedDelivery: '2026-03-10' },
    { id: '2', supplier: 'Fronius GmbH', items: [{ name: 'Wechselrichter', quantity: 10, price: 8500 }], status: 'delayed', expectedDelivery: '2026-03-08' },
    { id: '3', supplier: 'Tesla', items: [{ name: 'Powerwall 2', quantity: 5, price: 12500 }], status: 'ordered', expectedDelivery: '2026-03-15' },
  ];
};

export const fetchInstallationProjects = async (): Promise<InstallationProject[]> => {
  return [
    { id: '1', customer: 'Fam. Weber', address: 'Karlsruhe, Bismarckstr. 23', status: 'electrical', startDate: '2026-02-20', plannedEndDate: '2026-03-15', panels: 24, power: 9.6 },
    { id: '2', customer: 'Gewerbehalle Mayer', address: 'Stuttgart, Industriestr. 8', status: 'roof-mount', startDate: '2026-03-01', plannedEndDate: '2026-03-25', panels: 120, power: 48 },
    { id: '3', customer: 'Fam. Becker', address: 'Heidelberg, Ringstr. 5', status: 'inspection', startDate: '2026-02-10', plannedEndDate: '2026-03-05', panels: 18, power: 7.2 },
  ];
};

export const fetchSolarFinancials = async (): Promise<SolarFinancials> => {
  return {
    monthlyRevenue: 285000,
    cashflow: 42000,
    pendingSubsidies: 35000,
    avgRevenuePerInstallation: 32000,
  };
};

// ---------- Elysium APIs ----------
export const fetchDealPipeline = async (): Promise<DealPipeline[]> => {
  return [
    { id: '1', property: 'Wohnung Kassel', address: 'Kassel, Hauptstr. 12', purchasePrice: 185000, renovationCosts: 45000, expectedSalePrice: 295000, roi: 24, stage: 'notar', foundDate: '2025-11-15' },
    { id: '2', property: 'Haus Heidelberg', address: 'Heidelberg, Bergstr. 8', purchasePrice: 420000, renovationCosts: 85000, expectedSalePrice: 580000, roi: 18, stage: 'renovation', foundDate: '2025-12-01' },
    { id: '3', property: 'Etagenwohnung Stuttgart', address: 'Stuttgart, Königstr. 22', purchasePrice: 275000, renovationCosts: 35000, expectedSalePrice: 365000, roi: 19, stage: 'inspection', foundDate: '2026-01-20' },
    { id: '4', property: 'Reihenhaus Mannheim', address: 'Mannheim, Ring 15', purchasePrice: 310000, renovationCosts: 55000, expectedSalePrice: 420000, roi: 16, stage: 'calculating', foundDate: '2026-02-15' },
    { id: '5', property: 'Villa Karlsruhe', address: 'Karlsruhe, Am Schloss 1', purchasePrice: 850000, renovationCosts: 180000, expectedSalePrice: 1200000, roi: 11, stage: 'negotiation', foundDate: '2026-01-05' },
  ];
};

export const fetchRenovationPhases = async (_dealId: string): Promise<RenovationPhase[]> => {
  return [
    { id: 'r1', dealId: '2', phase: 'planning', status: 'completed', cost: 5000, endDate: '2025-12-15' },
    { id: 'r2', dealId: '2', phase: 'demolition', status: 'completed', cost: 8500, endDate: '2026-01-10' },
    { id: 'r3', dealId: '2', phase: 'electrical', status: 'in-progress', cost: 12000, startDate: '2026-02-01' },
    { id: 'r4', dealId: '2', phase: 'drywall', status: 'not-started', cost: 15000 },
    { id: 'r5', dealId: '2', phase: 'flooring', status: 'not-started', cost: 18000 },
    { id: 'r6', dealId: '2', phase: 'painting', status: 'not-started', cost: 12000 },
  ];
};

export const fetchHandymen = async (): Promise<Handyman[]> => {
  return [
    { id: '1', name: 'Hans Müller', specialty: 'Elektrik', phone: '+49 171 1234567', email: 'hans@elektro-mueller.de', rating: 4.8 },
    { id: '2', name: 'Peter Schmidt', specialty: 'Trockenbau', phone: '+49 172 2345678', rating: 4.5 },
    { id: '3', name: 'Stephan Bauer', specialty: 'Maler', phone: '+49 173 3456789', email: 'maler-bauer@t-online.de', rating: 4.9 },
    { id: '4', name: 'Thomas Wagner', specialty: 'Sanitär', phone: '+49 174 4567890', rating: 4.6 },
  ];
};

export const fetchMarketingTrackers = async (): Promise<MarketingTracker[]> => {
  return [
    { dealId: '1', staging: true, stagingDate: '2026-02-28', photoshoot: true, photoshootDate: '2026-03-01', listingsOnline: true, listingDate: '2026-03-02', viewings: 8, notarDate: '2026-03-20' },
    { dealId: '2', staging: false, photoshoot: false, listingsOnline: false, viewings: 0 },
    { dealId: '3', staging: true, stagingDate: '2026-03-10', photoshoot: false, listingsOnline: false, viewings: 0 },
  ];
};

export const fetchPortfolioFinance = async (): Promise<PortfolioFinance> => {
  return {
    totalCapitalInvested: 1245000,
    averageFlipDays: 142,
    netProfit12Months: 387000,
    activeDeals: 4,
    dealsInRenovation: 2,
    dealsForSale: 1,
  };
};

// ============================================
// NEW: CRM, Finance, Projects, Docs, Team APIs
// ============================================

// ---------- CRM APIs (Shared) ----------
export const fetchCompanyContacts = async (company?: string): Promise<CompanyContact[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allContacts: CompanyContact[] = [
    // Celaris
    { id: 'c1', name: 'Hans Weber', email: 'hans.weber@solarpro.de', phone: '+49 171 1111111', role: 'CTO', company: 'SolarPro GmbH', companyId: 'comp1', createdAt: '2025-06-01', lastContact: '2026-03-01' },
    { id: 'c2', name: 'Sarah Schmidt', email: 's.schmidt@gewerbebau.ag', phone: '+49 172 2222222', role: 'Geschäftsführer', company: 'Gewerbebau AG', companyId: 'comp2', createdAt: '2025-08-15', lastContact: '2026-02-28' },
    { id: 'c3', name: 'Thomas Braun', email: 't.braun@energie-bieter.de', phone: '+49 173 3333333', role: 'Einkauf', company: 'Bieter Energie', companyId: 'comp3', createdAt: '2025-11-20', lastContact: '2026-01-15' },
    { id: 'c4', name: 'Lisa Müller', email: 'l.mueller@gewobau.de', phone: '+49 174 4444444', role: 'Projektleitung', company: 'Gewobau GmbH', companyId: 'comp4', createdAt: '2026-01-10' },
    // Elysium
    { id: 'c5', name: 'Michael Frank', email: 'm.frank@gmx.de', phone: '+49 175 5555555', role: 'Eigentümer', company: 'Privat', createdAt: '2025-10-05', lastContact: '2026-03-02' },
    { id: 'c6', name: 'Julia Klein', email: 'j.klein@makler-bw.de', phone: '+49 176 6666666', role: 'Makler', company: 'Makler BW', companyId: 'comp5', createdAt: '2025-07-20', lastContact: '2026-02-25' },
    { id: 'c7', name: 'Kevin Haas', email: 'k.haas@handwerk-haas.de', phone: '+49 177 7777777', role: 'Inhaber', company: 'Handwerk Haas', companyId: 'comp6', createdAt: '2025-09-12', lastContact: '2026-02-20' },
    // Pathium
    { id: 'c8', name: 'Anna Becker', email: 'anna@acmecorp.de', phone: '+49 178 8888888', role: 'CTO', company: 'Acme Corp', companyId: 'comp7', createdAt: '2025-05-01', lastContact: '2026-03-03' },
    { id: 'c9', name: 'Oliver Wagner', email: 'o.wagner@techstart.io', phone: '+49 179 9999999', role: 'Head of Engineering', company: 'TechStart', companyId: 'comp8', createdAt: '2025-08-01', lastContact: '2026-02-28' },
    { id: 'c10', name: 'Nina Richter', email: 'nina@designco.de', phone: '+49 180 1010101', role: 'Product Manager', company: 'DesignCo', companyId: 'comp9', createdAt: '2025-12-01', lastContact: '2026-02-15' },
  ];
  if (company) {
    return allContacts.filter(c => c.company?.toLowerCase().includes(company.toLowerCase()));
  }
  return allContacts;
};

export const fetchCompanies = async (): Promise<Company[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [
    { id: 'comp1', name: 'SolarPro GmbH', type: 'b2b', industry: 'Solar', website: 'https://solarpro.de', contacts: ['c1'], createdAt: '2025-06-01' },
    { id: 'comp2', name: 'Gewerbebau AG', type: 'b2b', industry: 'Bau', contacts: ['c2'], createdAt: '2025-08-15' },
    { id: 'comp3', name: 'Bieter Energie', type: 'b2b', industry: 'Energie', contacts: ['c3'], createdAt: '2025-11-20' },
    { id: 'comp4', name: 'Gewobau GmbH', type: 'b2b', industry: 'Immobilien', contacts: ['c4'], createdAt: '2026-01-10' },
    { id: 'comp5', name: 'Makler BW', type: 'partner', industry: 'Immobilien', contacts: ['c6'], createdAt: '2025-07-20' },
    { id: 'comp6', name: 'Handwerk Haas', type: 'supplier', industry: 'Handwerk', contacts: ['c7'], createdAt: '2025-09-12' },
    { id: 'comp7', name: 'Acme Corp', type: 'b2b', industry: 'Software', website: 'https://acmecorp.de', contacts: ['c8'], createdAt: '2025-05-01' },
    { id: 'comp8', name: 'TechStart', type: 'b2b', industry: 'Software', website: 'https://techstart.io', contacts: ['c9'], createdAt: '2025-08-01' },
    { id: 'comp9', name: 'DesignCo', type: 'b2b', industry: 'Design', contacts: ['c10'], createdAt: '2025-12-01' },
  ];
};

export const fetchActivities = async (companyId?: string): Promise<Activity[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allActivities: Activity[] = [
    { id: 'a1', type: 'meeting', title: 'Besichtigung Solarpark', description: 'Vor-Ort Termin mit SolarPro', contactId: 'c1', companyId: 'comp1', date: '2026-03-06T10:00:00', duration: 120, outcome: 'Positiv' },
    { id: 'a2', type: 'email', title: 'Angebot gesendet', description: 'Kostenvoranschlag für 50kWp Anlage', contactId: 'c2', companyId: 'comp2', date: '2026-03-03T14:30:00', outcome: 'Angebot offen' },
    { id: 'a3', type: 'call', title: 'Telefonat Einkauf', description: 'Preisverhandlung Lieferung Q2', contactId: 'c3', companyId: 'comp3', date: '2026-03-01T11:00:00', duration: 30 },
    { id: 'a4', type: 'meeting', title: 'Notartermin', description: 'Kaufvertrag Wohnung Kassel', contactId: 'c5', companyId: 'comp1', date: '2026-03-20T10:00:00', duration: 60 },
    { id: 'a5', type: 'note', title: 'Besichtigung organisiert', description: 'Makler kontaktiert, Termin bestätigt', contactId: 'c6', date: '2026-03-02T09:00:00' },
    { id: 'a6', type: 'call', title: 'Support Call', description: 'Login-Issue behoben', contactId: 'c8', companyId: 'comp7', date: '2026-03-03T08:00:00', duration: 45, outcome: 'Gelöst' },
    { id: 'a7', type: 'meeting', title: 'Sprint Planning', description: 'Sprint 13 Planung', contactId: 'c9', companyId: 'comp8', date: '2026-03-10T14:00:00', duration: 90 },
    { id: 'a8', type: 'email', title: 'Feature Request erhalten', description: 'Dark Mode Anfrage', contactId: 'c10', companyId: 'comp9', date: '2026-03-01T10:00:00' },
  ];
  if (companyId) {
    return allActivities.filter(a => a.companyId === companyId);
  }
  return allActivities;
};

// ---------- Finance APIs ----------
export const fetchInvoices = async (company?: string): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allInvoices: Invoice[] = [
    { id: 'inv1', invoiceNumber: 'CEL-2026-001', type: 'invoice', status: 'paid', customerId: 'c3', projectId: 'proj1', items: [{ description: 'Solaranlage 45kWp', quantity: 1, unitPrice: 45000, total: 45000 }], subtotal: 45000, tax: 8550, total: 53550, issueDate: '2026-01-15', dueDate: '2026-02-15', paidDate: '2026-02-10' },
    { id: 'inv2', invoiceNumber: 'CEL-2026-002', type: 'invoice', status: 'sent', customerId: 'c1', projectId: 'proj2', items: [{ description: 'Solaranlage 28kWp', quantity: 1, unitPrice: 28000, total: 28000 }], subtotal: 28000, tax: 5320, total: 33320, issueDate: '2026-02-28', dueDate: '2026-03-30' },
    { id: 'inv3', invoiceNumber: 'CEL-2026-003', type: 'quote', status: 'draft', customerId: 'c2', items: [{ description: 'Gewerbedach 120kWp', quantity: 1, unitPrice: 120000, total: 120000 }], subtotal: 120000, tax: 22800, total: 142800, issueDate: '2026-03-03', dueDate: '2026-04-03' },
    { id: 'inv4', invoiceNumber: 'ELY-2026-001', type: 'invoice', status: 'paid', projectId: 'proj5', items: [{ description: 'Maklerprovision', quantity: 1, unitPrice: 14750, total: 14750 }], subtotal: 14750, tax: 0, total: 14750, issueDate: '2026-01-20', dueDate: '2026-02-20', paidDate: '2026-02-15' },
    { id: 'inv5', invoiceNumber: 'ELY-2026-002', type: 'invoice', status: 'overdue', projectId: 'proj6', items: [{ description: 'Renovierung Bad', quantity: 1, unitPrice: 8500, total: 8500 }], subtotal: 8500, tax: 1615, total: 10115, issueDate: '2026-01-10', dueDate: '2026-02-10' },
    { id: 'inv6', invoiceNumber: 'PATH-2026-001', type: 'invoice', status: 'paid', customerId: 'c8', items: [{ description: 'SaaS Subscription Q1', quantity: 3, unitPrice: 2500, total: 7500 }], subtotal: 7500, tax: 1425, total: 8925, issueDate: '2026-01-01', dueDate: '2026-01-31', paidDate: '2026-01-15' },
    { id: 'inv7', invoiceNumber: 'PATH-2026-002', type: 'invoice', status: 'paid', customerId: 'c9', items: [{ description: 'SaaS Subscription Q1', quantity: 3, unitPrice: 4000, total: 12000 }], subtotal: 12000, tax: 2280, total: 14280, issueDate: '2026-01-01', dueDate: '2026-01-31', paidDate: '2026-01-20' },
    { id: 'inv8', invoiceNumber: 'PATH-2026-003', type: 'invoice', status: 'sent', customerId: 'c10', items: [{ description: 'SaaS Subscription Q1', quantity: 3, unitPrice: 1800, total: 5400 }], subtotal: 5400, tax: 1026, total: 6426, issueDate: '2026-02-01', dueDate: '2026-03-01' },
  ];
  return allInvoices;
};

export const fetchTransactions = async (company?: string): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allTransactions: Transaction[] = [
    // Celaris
    { id: 't1', type: 'income', category: 'Installation', amount: 53550, description: 'SolarPro GmbH - Installation', date: '2026-02-10', invoiceId: 'inv1' },
    { id: 't2', type: 'expense', category: 'Material', amount: 12500, description: 'Solarmodule SolarWorld', date: '2026-02-15', projectId: 'proj1' },
    { id: 't3', type: 'expense', category: 'Material', amount: 8500, description: 'Wechselrichter Fronius', date: '2026-02-20', projectId: 'proj1' },
    { id: 't4', type: 'expense', category: 'Personal', amount: 4500, description: 'Installateur Feb 2026', date: '2026-02-28' },
    { id: 't5', type: 'income', category: 'Wartung', amount: 2400, description: 'Wartungsvertrag Weber', date: '2026-03-01' },
    { id: 't6', type: 'expense', category: 'Fahrt', amount: 380, description: 'Benzin/Besichtigungen', date: '2026-03-02' },
    // Elysium
    { id: 't7', type: 'expense', category: 'Kauf', amount: 185000, description: 'Wohnung Kassel - Kaufpreis', date: '2025-12-15', projectId: 'proj5' },
    { id: 't8', type: 'expense', category: 'Renovierung', amount: 45000, description: 'Sanierung Kassel', date: '2026-01-10', projectId: 'proj5' },
    { id: 't9', type: 'expense', category: 'Notar', amount: 3200, description: 'Notarkosten Kauf', date: '2025-12-20', projectId: 'proj5' },
    { id: 't10', type: 'income', category: 'Verkauf', amount: 295000, description: 'Verkauf Wohnung Kassel', date: '2026-02-15', projectId: 'proj5' },
    { id: 't11', type: 'expense', category: 'Makler', amount: 14750, description: 'Provision Makler BW', date: '2026-02-15', projectId: 'proj5' },
    { id: 't12', type: 'expense', category: 'Renovierung', amount: 85000, description: 'Haus Heidelberg - Renovierung', date: '2026-01-15', projectId: 'proj6' },
    // Pathium
    { id: 't13', type: 'income', category: 'SaaS', amount: 8925, description: 'Acme Corp Q1', date: '2026-01-15', invoiceId: 'inv6' },
    { id: 't14', type: 'income', category: 'SaaS', amount: 14280, description: 'TechStart Q1', date: '2026-01-20', invoiceId: 'inv7' },
    { id: 't15', type: 'expense', category: 'Cloud', amount: 1240, description: 'AWS Rechnung Feb', date: '2026-02-05' },
    { id: 't16', type: 'expense', category: 'Cloud', amount: 600, description: 'Vercel Feb', date: '2026-02-05' },
    { id: 't17', type: 'expense', category: 'Personal', amount: 8500, description: 'Entwickler Feb', date: '2026-02-28' },
  ];
  return allTransactions;
};

export const fetchFinancialSummary = async (company?: string): Promise<FinancialSummary> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return {
    totalIncome: company === 'celaris' ? 55950 : company === 'elysium' ? 295000 : company === 'pathium' ? 23205 : 374155,
    totalExpenses: company === 'celaris' ? 26380 : company === 'elysium' ? 330950 : company === 'pathium' ? 11340 : 368670,
    netProfit: company === 'celaris' ? 29570 : company === 'elysium' ? -35950 : company === 'pathium' ? 11865 : 5485,
    pendingInvoices: company === 'pathium' ? 1 : 2,
    overdueInvoices: company === 'elysium' ? 1 : 0,
    period: 'month',
  };
};

// ---------- Project APIs ----------
export const fetchProjects = async (company?: string): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allProjects: Project[] = [
    // Celaris
    { id: 'proj1', name: 'SolarPro GmbH - 45kWp', description: 'Gewerbedach Installation', status: 'completed', startDate: '2026-01-01', endDate: '2026-02-10', budget: 50000, actualCost: 48500, teamMembers: ['tm1', 'tm2'], milestones: [{ id: 'm1', title: 'Besichtigung', status: 'completed', dueDate: '2026-01-05', completedDate: '2026-01-04' }, { id: 'm2', title: 'Installation', status: 'completed', dueDate: '2026-02-01', completedDate: '2026-02-05' }, { id: 'm3', title: 'Abnahme', status: 'completed', dueDate: '2026-02-10', completedDate: '2026-02-10' }], contactId: 'c1', companyId: 'comp1', createdAt: '2025-12-01' },
    { id: 'proj2', name: 'Fam. Weber - 28kWp', description: ' Einfamilienhaus', status: 'active', startDate: '2026-02-20', deadline: '2026-03-20', budget: 32000, teamMembers: ['tm1'], milestones: [{ id: 'm4', title: 'Besichtigung', status: 'completed', dueDate: '2026-02-22', completedDate: '2026-02-21' }, { id: 'm5', title: 'Installation', status: 'in-progress', dueDate: '2026-03-15' }, { id: 'm6', title: 'Abnahme', status: 'pending', dueDate: '2026-03-20' }], contactId: 'c4', companyId: 'comp4', createdAt: '2026-02-01' },
    { id: 'proj3', name: 'Gewerbebau AG - 120kWp', description: 'Großprojekt Industriehalle', status: 'planning', startDate: '2026-03-15', deadline: '2026-05-30', budget: 145000, teamMembers: ['tm1', 'tm2', 'tm3'], milestones: [{ id: 'm7', title: 'Angebot', status: 'in-progress', dueDate: '2026-03-10' }, { id: 'm8', title: 'Planung', status: 'pending', dueDate: '2026-04-01' }, { id: 'm9', title: 'Installation', status: 'pending', dueDate: '2026-05-15' }], contactId: 'c2', companyId: 'comp2', createdAt: '2026-02-15' },
    { id: 'proj4', name: 'Wartung Weber', description: 'Jährliche Wartung', status: 'active', startDate: '2026-01-01', deadline: '2026-12-31', budget: 2400, teamMembers: ['tm3'], milestones: [], contactId: 'c4', companyId: 'comp4', createdAt: '2026-01-01' },
    // Elysium
    { id: 'proj5', name: 'Wohnung Kassel', description: 'Fix & Flip - Hauptstr. 12', status: 'completed', startDate: '2025-11-15', endDate: '2026-02-15', budget: 240000, actualCost: 230000, teamMembers: ['tm4'], milestones: [{ id: 'm10', title: 'Kauf', status: 'completed', dueDate: '2025-12-15', completedDate: '2025-12-15' }, { id: 'm11', title: 'Renovierung', status: 'completed', dueDate: '2026-02-01', completedDate: '2026-02-05' }, { id: 'm12', title: 'Verkauf', status: 'completed', dueDate: '2026-02-15', completedDate: '2026-02-15' }], contactId: 'c5', createdAt: '2025-11-01' },
    { id: 'proj6', name: 'Haus Heidelberg', description: 'Fix & Flip - Bergstr. 8', status: 'active', startDate: '2025-12-01', deadline: '2026-04-30', budget: 520000, actualCost: 95000, teamMembers: ['tm4'], milestones: [{ id: 'm13', title: 'Kauf', status: 'completed', dueDate: '2025-12-20', completedDate: '2025-12-18' }, { id: 'm14', title: 'Renovierung', status: 'in-progress', dueDate: '2026-04-01' }, { id: 'm15', title: 'Verkauf', status: 'pending', dueDate: '2026-04-30' }], contactId: 'c5', createdAt: '2025-11-20' },
    { id: 'proj7', name: 'Etagenwohnung Stuttgart', description: 'Kauf - Königstr. 22', status: 'planning', startDate: '2026-01-20', deadline: '2026-06-30', budget: 320000, teamMembers: ['tm4'], milestones: [{ id: 'm16', title: 'Besichtigung', status: 'completed', dueDate: '2026-01-25', completedDate: '2026-01-24' }, { id: 'm17', title: 'Kauf', status: 'pending', dueDate: '2026-03-15' }], createdAt: '2026-01-20' },
    // Pathium
    { id: 'proj8', name: 'Sprint 12 - Billing', description: 'Billing Features implementieren', status: 'active', startDate: '2026-03-01', deadline: '2026-03-14', budget: 8500, teamMembers: ['tm5', 'tm6'], milestones: [{ id: 'm18', title: 'API Endpoint', status: 'completed', dueDate: '2026-03-05', completedDate: '2026-03-04' }, { id: 'm19', title: 'Dashboard', status: 'in-progress', dueDate: '2026-03-10' }, { id: 'm20', title: 'Testing', status: 'pending', dueDate: '2026-03-13' }], contactId: 'c8', companyId: 'comp7', createdAt: '2026-02-25' },
    { id: 'proj9', name: 'Sprint 13 - User Features', description: 'User Settings & Profile', status: 'planning', startDate: '2026-03-15', deadline: '2026-03-28', budget: 9000, teamMembers: ['tm5', 'tm6'], milestones: [], contactId: 'c9', companyId: 'comp8', createdAt: '2026-03-01' },
    { id: 'proj10', name: 'API v2 Development', description: 'Neue API Version entwickeln', status: 'planning', startDate: '2026-04-01', deadline: '2026-06-30', budget: 45000, teamMembers: ['tm5', 'tm6', 'tm7'], milestones: [], createdAt: '2026-02-15' },
  ];
  if (company) {
    const companyMap: Record<string, string[]> = { celaris: ['proj1', 'proj2', 'proj3', 'proj4'], elysium: ['proj5', 'proj6', 'proj7'], pathium: ['proj8', 'proj9', 'proj10'] };
    return allProjects.filter(p => companyMap[company]?.includes(p.id));
  }
  return allProjects;
};

// ---------- Document APIs ----------
export const fetchDocuments = async (company?: string): Promise<Document[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allDocs: Document[] = [
    // Celaris
    { id: 'doc1', name: 'Kostenvoranschlag SolarPro 45kWp', type: 'quote', category: 'Angebot', projectId: 'proj1', companyId: 'comp1', createdAt: '2025-12-15', updatedAt: '2025-12-15', tags: ['solar', 'gewerbe'] },
    { id: 'doc2', name: 'Lieferantenvertrag SolarWorld', type: 'contract', category: 'Lieferant', companyId: 'comp1', createdAt: '2025-06-01', updatedAt: '2025-06-01', tags: ['vertrag', 'lieferant'] },
    { id: 'doc3', name: 'Förderantrag BAFA - Weber', type: 'template', category: 'Förderung', projectId: 'proj2', createdAt: '2026-02-20', updatedAt: '2026-02-20', tags: ['förderung', 'bafa'] },
    { id: 'doc4', name: 'Wartungsvertrag Muster', type: 'template', category: 'Vertrag', createdAt: '2025-01-01', updatedAt: '2025-01-01', tags: ['wartung', 'muster'] },
    { id: 'doc5', name: 'Angebot Gewerbebau 120kWp', type: 'quote', category: 'Angebot', projectId: 'proj3', companyId: 'comp2', createdAt: '2026-03-03', updatedAt: '2026-03-03', tags: ['solar', 'gewerbe', 'groß'] },
    // Elysium
    { id: 'doc6', name: 'Kaufvertrag Wohnung Kassel', type: 'contract', category: 'Kauf', projectId: 'proj5', createdAt: '2025-12-15', updatedAt: '2025-12-15', tags: ['kauf', 'kassel'] },
    { id: 'doc7', name: 'Mietvertrag Heidelberg', type: 'contract', category: 'Miete', projectId: 'proj6', createdAt: '2026-01-10', updatedAt: '2026-01-10', tags: ['miete', 'heidelberg'] },
    { id: 'doc8', name: 'Renovierungsangebot Handwerk Haas', type: 'quote', category: 'Renovierung', projectId: 'proj5', createdAt: '2025-12-20', updatedAt: '2025-12-20', tags: ['renovierung', 'angebot'] },
    { id: 'doc9', name: 'Baupläne Kassel', type: 'report', category: 'Bau', projectId: 'proj5', createdAt: '2025-11-20', updatedAt: '2026-01-15', tags: ['bau', 'plan'] },
    // Pathium
    { id: 'doc10', name: 'API Documentation v2', type: 'report', category: 'Technisch', projectId: 'proj10', createdAt: '2026-02-01', updatedAt: '2026-03-01', tags: ['api', 'doku'] },
    { id: 'doc11', name: 'Product Roadmap 2026', type: 'report', category: 'Roadmap', createdAt: '2026-01-15', updatedAt: '2026-01-15', tags: ['roadmap', '2026'] },
    { id: 'doc12', name: 'Sprint Review Sprint 11', type: 'report', category: 'Sprint', projectId: 'proj8', createdAt: '2026-02-28', updatedAt: '2026-02-28', tags: ['sprint', 'review'] },
    { id: 'doc13', name: ' SLA Agreement Template', type: 'template', category: 'Vertrag', createdAt: '2025-08-01', updatedAt: '2025-08-01', tags: ['sla', 'vorlage'] },
  ];
  if (company) {
    const companyMap: Record<string, string[]> = { celaris: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'], elysium: ['doc6', 'doc7', 'doc8', 'doc9'], pathium: ['doc10', 'doc11', 'doc12', 'doc13'] };
    return allDocs.filter(d => companyMap[company]?.includes(d.id));
  }
  return allDocs;
};

// ---------- Team APIs ----------
export const fetchTeamMembers = async (company?: string): Promise<TeamMember[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allMembers: TeamMember[] = [
    // Celaris
    { id: 'tm1', name: 'Klaus Becker', email: 'k.becker@celaris.de', phone: '+49 171 1010101', role: 'Vertrieb', department: 'Vertrieb', hourlyRate: 65, availability: 40, skills: ['Vertrieb', 'Beschaffung'], joinedAt: '2024-01-15' },
    { id: 'tm2', name: 'Maria Santos', email: 'm.santos@celaris.de', phone: '+49 171 2020202', role: 'Installateur', department: 'Technik', hourlyRate: 55, availability: 40, skills: ['Installation', 'Elektrik'], joinedAt: '2024-03-20' },
    { id: 'tm3', name: 'Thomas Wolf', email: 't.wolf@celaris.de', phone: '+49 171 3030303', role: 'Techniker', department: 'Technik', hourlyRate: 50, availability: 40, skills: ['Wartung', 'Reparatur'], joinedAt: '2024-06-01' },
    // Elysium
    { id: 'tm4', name: 'Petra Meyer', email: 'p.meyer@elysium.de', phone: '+49 172 4040404', role: 'Projektmanager', department: 'Projekt', hourlyRate: 75, availability: 20, skills: ['Immobilien', 'Projektmanagement'], joinedAt: '2025-01-10' },
    // Pathium
    { id: 'tm5', name: 'Alex Chen', email: 'alex@pathium.dev', phone: '+49 173 5050505', role: 'Senior Developer', department: 'Development', hourlyRate: 85, availability: 40, skills: ['TypeScript', 'React', 'Node.js'], avatar: 'AC', joinedAt: '2024-02-01' },
    { id: 'tm6', name: 'Sam Taylor', email: 'sam@pathium.dev', phone: '+49 173 6060606', role: 'Full Stack Developer', department: 'Development', hourlyRate: 70, availability: 40, skills: ['Python', 'React', 'AWS'], avatar: 'ST', joinedAt: '2024-05-15' },
    { id: 'tm7', name: 'Jordan Lee', email: 'jordan@pathium.dev', phone: '+49 173 7070707', role: 'DevOps Engineer', department: 'Infrastructure', hourlyRate: 80, availability: 40, skills: ['Kubernetes', 'Docker', 'CI/CD'], avatar: 'JL', joinedAt: '2024-08-01' },
    { id: 'tm8', name: 'Casey Brown', email: 'casey@pathium.dev', phone: '+49 174 8080808', role: 'Support', department: 'Support', hourlyRate: 45, availability: 40, skills: ['Support', 'Kommunikation'], avatar: 'CB', joinedAt: '2025-01-20' },
  ];
  if (company) {
    const companyMap: Record<string, string[]> = { celaris: ['tm1', 'tm2', 'tm3'], elysium: ['tm4'], pathium: ['tm5', 'tm6', 'tm7', 'tm8'] };
    return allMembers.filter(m => companyMap[company]?.includes(m.id));
  }
  return allMembers;
};

export const fetchTeamTasks = async (company?: string): Promise<TeamTask[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const allTasks: TeamTask[] = [
    { id: 'tt1', title: 'Angebot SolarPro finalisieren', description: 'Preise verifizieren und senden', assigneeId: 'tm1', projectId: 'proj3', status: 'in-progress', priority: 'high', dueDate: '2026-03-10', estimatedHours: 4 },
    { id: 'tt2', title: 'Installation Fam. Weber', description: 'Elektrik verlegen', assigneeId: 'tm2', projectId: 'proj2', status: 'in-progress', priority: 'high', dueDate: '2026-03-15', estimatedHours: 16 },
    { id: 'tt3', title: 'Wartung Weber Dach', description: 'Jährliche Prüfung', assigneeId: 'tm3', projectId: 'proj4', status: 'todo', priority: 'medium', dueDate: '2026-03-20', estimatedHours: 2 },
    { id: 'tt4', title: 'Besichtigung Heidelberg', description: 'Renovierungsstatus prüfen', assigneeId: 'tm4', projectId: 'proj6', status: 'in-progress', priority: 'medium', dueDate: '2026-03-08', estimatedHours: 3 },
    { id: 'tt5', title: 'Dashboard Charts implementieren', assigneeId: 'tm5', projectId: 'proj8', status: 'in-progress', priority: 'high', dueDate: '2026-03-10', estimatedHours: 8, actualHours: 5 },
    { id: 'tt6', title: 'API Tests schreiben', assigneeId: 'tm6', projectId: 'proj8', status: 'todo', priority: 'medium', dueDate: '2026-03-12', estimatedHours: 6 },
    { id: 'tt7', title: 'CI/CD Pipeline optimieren', description: 'Build Times reduzieren', assigneeId: 'tm7', status: 'todo', priority: 'low', estimatedHours: 4 },
    { id: 'tt8', title: 'Support Ticket Acme', assigneeId: 'tm8', status: 'done', priority: 'urgent', dueDate: '2026-03-03', estimatedHours: 2, actualHours: 2.5 },
  ];
  if (company) {
    const companyMap: Record<string, string[]> = { celaris: ['tt1', 'tt2', 'tt3'], elysium: ['tt4'], pathium: ['tt5', 'tt6', 'tt7', 'tt8'] };
    return allTasks.filter(t => companyMap[company]?.includes(t.id));
  }
  return allTasks;
};
