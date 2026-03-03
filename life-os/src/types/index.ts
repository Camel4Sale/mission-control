// ============================================
// LIFE OS - TypeScript Interfaces
// ============================================

// ---------- Shared Types ----------
export type Area = 'kit' | 'pathium' | 'celaris' | 'elysium';

export type Status = 'green' | 'yellow' | 'red';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  area: Area;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  area: Area;
  type: 'lecture' | 'exam' | 'deadline' | 'meeting' | 'sprint' | 'delivery' | 'milestone' | 'inspection';
  location?: string;
  color?: string;
}

// ---------- KIT (Studium) ----------
export interface Module {
  id: string;
  name: string;
  code: string;
  ects: number;
  grade?: number;
  semester: number;
  category: 'pflicht' | 'wahlpflicht-ing' | 'wahlpflicht-wiwi' | 'vertiefung';
  status: 'passed' | 'registered' | 'upcoming';
}

export interface Exam {
  id: string;
  moduleId: string;
  date: string;
  location?: string;
  preparationProgress: number; // 0-100
  oldExamsCompleted: number;
  totalOldExams: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export interface ThesisPhase {
  id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
}

export interface GradePrediction {
  currentAverage: number;
  predictedFinal: number;
  targetGrade?: number;
  neededGrade?: number;
}

// ---------- Pathium (Software) ----------
export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  velocity: number;
  storyPointsCompleted: number;
  storyPointsTotal: number;
  status: 'planned' | 'active' | 'completed';
}

export interface JiraTicket {
  id: string;
  key: string;
  title: string;
  status: 'todo' | 'in-progress' | 'blocked' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  storyPoints?: number;
}

export interface DevOpsMetrics {
  dbLoad: number; // percentage
  apiLatency: number; // ms
  uptime: number; // percentage
  errorRate: number; // percentage
  activeServers: number;
}

export interface Financials {
  mrr: number; // Monthly Recurring Revenue
  mrrGrowth: number; // percentage
  churnRate: number; // percentage
  cloudCosts: number;
  awsCosts: number;
  vercelCosts: number;
}

export interface ProductMetrics {
  dau: number;
  mau: number;
  conversionRate: number;
  newUsers: number;
  activeUsersChange: number; // percentage
}

export interface SupportTicket {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  customer: string;
  createdAt: string;
  responseTime?: number; // hours
}

// ---------- Celaris (Solar) ----------
export interface SalesLead {
  id: string;
  name: string;
  company?: string;
  stage: 'first-contact' | 'offer-sent' | 'negotiation' | 'contract' | 'won' | 'lost';
  value: number; // Euro
  probability: number; // 0-100
  createdAt: string;
  expectedClose?: string;
}

export interface SupplyOrder {
  id: string;
  supplier: string;
  items: { name: string; quantity: number; price: number }[];
  status: 'ordered' | 'shipped' | 'delivered' | 'delayed';
  expectedDelivery: string;
  actualDelivery?: string;
}

export interface InstallationProject {
  id: string;
  customer: string;
  address: string;
  status: 'planning' | 'scaffolding' | 'roof-mount' | 'electrical' | 'inspection' | 'completed';
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  panels: number;
  power: number; // kWp
}

export interface SolarFinancials {
  monthlyRevenue: number;
  cashflow: number;
  pendingSubsidies: number;
  avgRevenuePerInstallation: number;
}

// ---------- Elysium (Real Estate) ----------
export interface DealPipeline {
  id: string;
  property: string;
  address: string;
  purchasePrice: number;
  renovationCosts: number;
  expectedSalePrice: number;
  roi: number; // percentage
  stage: 'found' | 'calculating' | 'inspection' | 'negotiation' | 'notar' | 'owned' | 'sold' | 'renovation';
  foundDate: string;
  notes?: string;
}

export interface RenovationPhase {
  id: string;
  dealId: string;
  phase: 'planning' | 'demolition' | 'plumbing' | 'electrical' | 'drywall' | 'flooring' | 'painting' | 'final';
  status: 'not-started' | 'in-progress' | 'completed';
  cost: number;
  startDate?: string;
  endDate?: string;
  contractor?: string;
}

export interface Handyman {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  rating?: number;
}

export interface MarketingTracker {
  dealId: string;
  staging: boolean;
  stagingDate?: string;
  photoshoot: boolean;
  photoshootDate?: string;
  listingsOnline: boolean;
  listingDate?: string;
  viewings: number;
  notarDate?: string;
  soldDate?: string;
}

export interface PortfolioFinance {
  totalCapitalInvested: number;
  averageFlipDays: number;
  netProfit12Months: number;
  activeDeals: number;
  dealsInRenovation: number;
  dealsForSale: number;
}

// ---------- API Response Types ----------
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  lastUpdated: string;
}

export interface HealthStatus {
  area: Area;
  status: Status;
  message: string;
  metrics: Record<string, number | string>;
}
