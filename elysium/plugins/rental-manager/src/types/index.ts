// Types für das Vermieter-Toolkit

export interface Property {
  id: string;
  name: string;
  type: 'wohnung' | 'haus' | 'gewerbe';
  address: {
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  details: {
    sqm: number;
    rooms: number;
    yearBuilt: number;
    floor?: number;
    totalFloors?: number;
    heatingType?: string;
    energyRating?: string;
  };
  documents: Document[];
  valueHistory: ValueHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  type: 'grundbuch' | 'energieausweis' | 'grundriss' | 'sonstige';
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface ValueHistoryEntry {
  date: Date;
  value: number;
  source: string;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    zip: string;
    city: string;
  };
  dateOfBirth?: string;
  occupation?: string;
  monthlyIncome?: number;
  schufaScore?: number;
  riskLevel: 'green' | 'yellow' | 'red';
  previousLandlord?: {
    name: string;
    contact: string;
    reference?: string;
  };
  createdAt: Date;
}

export interface RentalContract {
  id: string;
  propertyId: string;
  tenantIds: string[];
  type: 'wohnung' | 'haus' | 'gewerbe';
  startDate: Date;
  endDate?: Date;
  rent: {
    coldRent: number;
    warmRent?: number;
  };
  deposit: number;
  noticePeriod: number;
  specialClauses?: string[];
  language: 'de' | 'en' | 'tr';
  status: 'draft' | 'active' | 'terminated' | 'expired';
  signedAt?: Date;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  year: number;
  period: {
    start: Date;
    end: Date;
  };
  totalCosts: number;
  costs: UtilityCost[];
  distributionKey: 'sqm' | 'persons' | 'consumption' | 'mixed';
  tenantAllocations: TenantAllocation[];
  documents: Receipt[];
  status: 'draft' | 'finalized' | 'sent';
  createdAt: Date;
  finalizedAt?: Date;
}

export interface UtilityCost {
  category: string;
  amount: number;
  description: string;
}

export interface TenantAllocation {
  tenantId: string;
  sqm: number;
  persons?: number;
  consumption?: number;
  totalAmount: number;
  breakdown: CostBreakdown[];
}

export interface CostBreakdown {
  category: string;
  totalCost: number;
  tenantShare: number;
  unit?: string;
  consumption?: number;
}

export interface Receipt {
  id: string;
  category: string;
  amount: number;
  date: Date;
  vendor: string;
  description: string;
  imageUrl: string;
}

export interface RentPayment {
  id: string;
  contractId: string;
  tenantId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  bankTransactionId?: string;
  reminderSent: boolean;
  reminderCount: number;
}

export interface DefectReport {
  id: string;
  propertyId: string;
  tenantId?: string;
  category: 'heating' | 'plumbing' | 'electrical' | 'structural' | 'other';
  title: string;
  description: string;
  photos: Photo[];
  priority: 'urgent' | 'normal' | 'planned';
  status: 'open' | 'in_progress' | 'completed';
  assignedCraftsman?: Craftsman;
  costEstimate?: number;
  actualCost?: number;
  reportedAt: Date;
  completedAt?: Date;
}

export interface Photo {
  id: string;
  url: string;
  description?: string;
  uploadedAt: Date;
}

export interface Craftsman {
  id: string;
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  address: {
    street: string;
    zip: string;
    city: string;
  };
  ratings: Rating[];
  workHistory: WorkEntry[];
  costTracking: CostEntry[];
}

export interface Rating {
  id: string;
  date: Date;
  price: 1 | 2 | 3 | 4 | 5;
  quality: 1 | 2 | 3 | 4 | 5;
  punctuality: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface WorkEntry {
  id: string;
  date: Date;
  propertyId: string;
  defectId?: string;
  description: string;
  cost: number;
}

export interface CostEntry {
  id: string;
  propertyId: string;
  year: number;
  totalCost: number;
}

export interface BankConnection {
  id: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  blz: string;
  lastSync?: Date;
  status: 'active' | 'error' | 'disconnected';
}

export interface TenantScreening {
  id: string;
  tenantId: string;
  schufaScore?: number;
  schufaDetails?: SchufaDetails;
  incomeVerified: boolean;
  incomeDocuments: Document[];
  previousLandlordContacted: boolean;
  previousLandlordResponse?: string;
  riskAssessment: {
    level: 'green' | 'yellow' | 'red';
    factors: RiskFactor[];
  };
  consentGiven: boolean;
  consentDate?: Date;
  createdAt: Date;
}

export interface SchufaDetails {
  score: number;
  scoreDate: string;
  negativeEntries: number;
  creditCards: number;
  loans: number;
  mobileContracts: number;
  addressChanges: number;
}

export interface RiskFactor {
  type: 'income' | 'schufa' | 'history' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
