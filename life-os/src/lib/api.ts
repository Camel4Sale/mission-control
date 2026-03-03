// ============================================
// LIFE OS - Mock Data API
// ============================================
import { 
  Task, CalendarEvent, Area, Status,
  Module, Exam, ThesisPhase,
  Sprint, JiraTicket, DevOpsMetrics, Financials, ProductMetrics, SupportTicket,
  SalesLead, SupplyOrder, InstallationProject, SolarFinancials,
  DealPipeline, RenovationPhase, Handyman, MarketingTracker, PortfolioFinance,
  HealthStatus
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
