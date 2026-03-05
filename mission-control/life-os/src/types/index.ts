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

// ============================================
// NEW: CRM, Finance, Projects, Docs, Team Types
// ============================================

// ---------- Shared Company Types ----------
export interface CompanyContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  company?: string;
  companyId?: string;
  notes?: string;
  createdAt: string;
  lastContact?: string;
}

export interface Company {
  id: string;
  name: string;
  type: 'b2b' | 'b2c' | 'partner' | 'supplier';
  industry?: string;
  website?: string;
  address?: string;
  contacts: string[]; // contact IDs
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description?: string;
  contactId?: string;
  companyId?: string;
  projectId?: string;
  date: string;
  duration?: number; // minutes
  outcome?: string;
}

// ---------- Finance Types ----------
export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'invoice' | 'quote' | 'offer';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  customerId?: string;
  projectId?: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  projectId?: string;
  invoiceId?: string;
  isRecurring?: boolean;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  overdueInvoices: number;
  period: 'month' | 'quarter' | 'year';
}

// ---------- Project Types ----------
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  deadline?: string;
  budget?: number;
  actualCost?: number;
  teamMembers: string[]; // user/employee IDs
  milestones: Milestone[];
  contactId?: string;
  companyId?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  dueDate: string;
  completedDate?: string;
  deliverables?: string[];
}

// ---------- Document Types ----------
export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'quote' | 'invoice' | 'template' | 'report' | 'other';
  category: string;
  fileUrl?: string;
  content?: string;
  projectId?: string;
  companyId?: string;
  contactId?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// ---------- Team Types ----------
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  companyId?: string;
  hourlyRate?: number;
  availability?: number; // hours per week
  skills?: string[];
  avatar?: string;
  joinedAt?: string;
}

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  projectId?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}
