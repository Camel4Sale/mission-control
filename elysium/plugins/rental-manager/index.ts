/**
 * Elysium Rental Manager Plugin
 * 
 * Vermieter-Toolkit für die Elysium-Plattform
 * 
 * Features:
 * - Mietvertrag-Generator
 * - Nebenkosten-Abrechnung
 * - Mieteingänge-Tracker
 * - Mängelmelder
 * - Handwerker-Verwaltung
 * - Mieter-Screening
 * - Objekt-Verwaltung
 */

export { default as Dashboard } from './src/components/Dashboard';
export { default as PropertyManager } from './src/components/PropertyManager';
export { default as ContractGenerator } from './src/components/ContractGenerator';
export { default as UtilityBillCreator } from './src/components/UtilityBillCreator';
export { default as RentTracker } from './src/components/RentTracker';
export { default as DefectReporter } from './src/components/DefectReporter';
export { default as CraftsmenManager } from './src/components/CraftsmenManager';
export { default as TenantScreening } from './src/components/TenantScreening';

export { PdfGenerator } from './src/lib/pdf-generator';
export { BankingService } from './src/lib/banking';
export { SchufaService } from './src/lib/schufa';
export { ExcelExportService } from './src/lib/excel-export';
export { getTemplate, getAllTemplates } from './src/lib/contract-templates';

export * from './src/types';
