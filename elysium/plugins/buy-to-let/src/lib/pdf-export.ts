import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AnalysisResult,
  FinancingCalculation,
  CashflowAnalysis,
  LongTermProjection,
  ScenarioResult,
  ETFComparison,
  ExitPlan,
  PortfolioOverview,
} from '@/types';

/**
 * Export comprehensive investment analysis to PDF
 */
export function exportAnalysisToPDF(
  result: AnalysisResult,
  propertyName: string = 'Investment-Analyse',
  includeScenarios: boolean = true,
  includeETFComparison: boolean = true
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(propertyName, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, pageWidth / 2, 28, { align: 'center' });

  let yPos = 40;

  // 1. Financing Summary
  yPos = addFinancingSection(doc, result.financing, yPos);

  // 2. Cashflow Analysis
  yPos = addCashflowSection(doc, result.cashflow, yPos);

  // 3. Long-term Projections
  yPos = addProjectionsSection(doc, result.projections, yPos);

  // 4. Scenario Comparison
  if (includeScenarios && result.scenarios.length > 0) {
    yPos = addScenariosSection(doc, result.scenarios, yPos);
  }

  // 5. ETF Comparison
  if (includeETFComparison) {
    yPos = addETFComparisonSection(doc, result.etfComparison, yPos);
  }

  // 6. Exit Plan
  yPos = addExitPlanSection(doc, result.exitPlan, yPos);

  // Save PDF
  return doc.output('blob');
}

function addFinancingSection(doc: jsPDF, financing: FinancingCalculation, yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Finanzierungszusammenfassung', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const tableData = [
    ['Monatliche Rate', `${financing.monthlyRate.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Jährliche Belastung', `${financing.annualRate.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Gesamtzinsen', `${financing.totalInterest.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Gesamtrückzahlung', `${financing.totalRepayment.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Effektivzins', `${financing.effectiveInterestRate}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Kennzahl', 'Wert']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    margin: { left: 14, right: 14 },
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

function addCashflowSection(doc: jsPDF, cashflow: CashflowAnalysis, yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Cashflow-Analyse', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const isPositive = cashflow.monthlyCashflow >= 0;
  const cashflowColor: [number, number, number] = isPositive ? [34, 197, 94] : [239, 68, 68];

  const tableData = [
    ['Mieteinnahmen (monatlich)', `${cashflow.monthlyRentalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Mieteinnahmen (jährlich)', `${cashflow.annualRentalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Betriebskosten (monatlich)', `${cashflow.monthlyOperatingCosts.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Finanzierung (monatlich)', `${cashflow.monthlyFinancingCost.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Cashflow (monatlich)', `${cashflow.monthlyCashflow.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Cashflow (jährlich)', `${cashflow.annualCashflow.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ['Cash-on-Cash Rendite', `${cashflow.cashOnCashReturn}%`],
    ['Bruttorendite', `${cashflow.grossYield}%`],
    ['Nettorendite', `${cashflow.netYield}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Kennzahl', 'Wert']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: cashflowColor },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const cellValue = data.cell.raw?.toString() || '';
        if (cellValue.includes(cashflow.monthlyCashflow.toString())) {
          data.cell.styles.textColor = cashflowColor;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

function addProjectionsSection(doc: jsPDF, projections: LongTermProjection[], yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Langzeit-Prognose (Auswahl)', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Show key years: 1, 5, 10, 20, 30
  const keyYears = [1, 5, 10, 20, 30].filter((y) => y <= projections.length);
  const tableData = keyYears.map((year) => {
    const proj = projections[year - 1];
    return [
      year.toString(),
      proj.propertyValue.toLocaleString('de-DE'),
      proj.remainingDebt.toLocaleString('de-DE'),
      proj.equity.toLocaleString('de-DE'),
      proj.annualRent.toLocaleString('de-DE'),
      `${proj.roi}%`,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Jahr', 'Immobilienwert', 'Restschuld', 'Eigenkapital', 'Jahresmiete', 'ROI']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    margin: { left: 14, right: 14 },
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

function addScenariosSection(doc: jsPDF, scenarios: ScenarioResult[], yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Szenario-Vergleich', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const tableData = scenarios.map((scenario) => [
    scenario.scenario.name,
    scenario.totalReturn.toLocaleString('de-DE'),
    `${scenario.averageAnnualReturn.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
    scenario.finalEquity.toLocaleString('de-DE'),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Szenario', 'Gesamtrendite (€)', 'Ø Jahresrendite (%)', 'Endkapital (€)']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [126, 87, 194] },
    margin: { left: 14, right: 14 },
  });

  // Add scenario descriptions
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  scenarios.forEach((scenario) => {
    doc.text(`${scenario.scenario.name}: ${scenario.scenario.description}`, 14, yPos);
    yPos += 5;
  });

  return yPos + 10;
}

function addETFComparisonSection(doc: jsPDF, etfComparison: ETFComparison, yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('5. ETF-Vergleich', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const tableData = [
    ['Anlagesumme', `${etfComparison.investmentAmount.toLocaleString('de-DE')} €`],
    ['Laufzeit', `${etfComparison.investmentPeriodYears} Jahre`],
    ['Erwartete Rendite', `${etfComparison.expectedAnnualReturn}%`],
    ['Volatilität', `${etfComparison.volatility}%`],
    ['Maximaler Drawdown', `${etfComparison.maxDrawdown}%`],
    ['Endwert (brutto)', `${etfComparison.finalValue.toLocaleString('de-DE')} €`],
    ['Steuern', `${etfComparison.taxes.toLocaleString('de-DE')} €`],
    ['Endwert (netto)', `${(etfComparison.finalValue - etfComparison.taxes).toLocaleString('de-DE')} €`],
    ['Gesamtrendite', `${etfComparison.totalReturn.toLocaleString('de-DE')} €`],
    ['Ø Jahresrendite', `${etfComparison.averageAnnualReturn}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Kennzahl', 'Wert']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [245, 158, 11] },
    margin: { left: 14, right: 14 },
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

function addExitPlanSection(doc: jsPDF, exitPlan: ExitPlan, yPos: number): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('6. Exit-Planung', 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const tableData = [
    ['Verkauf nach', `${exitPlan.saleYear} Jahren`],
    ['Verkaufspreis', `${exitPlan.salePrice.toLocaleString('de-DE')} €`],
    ['Restschuld', `${exitPlan.remainingDebt.toLocaleString('de-DE')} €`],
    ['Bruttogewinn', `${exitPlan.grossProfit.toLocaleString('de-DE')} €`],
    ['Kapitalertragsteuer', `${exitPlan.capitalGainsTax.toLocaleString('de-DE')} €`],
    ['Nettogewinn', `${exitPlan.netProfit.toLocaleString('de-DE')} €`],
    ['Steuerfrei', exitPlan.isTaxFree ? 'Ja' : 'Nein'],
  ];

  if (exitPlan.installmentSale) {
    tableData.push(['Ratenverkauf', `${exitPlan.installmentSale.years} Jahre à ${exitPlan.installmentSale.annualPayments.toLocaleString('de-DE')} €`]);
    tableData.push(['Steuerstundung', `${exitPlan.installmentSale.taxDeferral.toLocaleString('de-DE')} €`]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Kennzahl', 'Wert']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    margin: { left: 14, right: 14 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Export portfolio overview to PDF
 */
export function exportPortfolioToPDF(
  portfolio: PortfolioOverview,
  propertyName: string = 'Portfolio-Übersicht'
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(propertyName, pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, pageWidth / 2, 28, { align: 'center' });

  let yPos = 40;

  // Portfolio Summary
  const summaryData = [
    ['Anzahl Objekte', portfolio.totalProperties.toString()],
    ['Gesamtinvestition', `${portfolio.totalInvestment.toLocaleString('de-DE')} €`],
    ['Gesamteigenkapital', `${portfolio.totalEquity.toLocaleString('de-DE')} €`],
    ['Gesamtfinanzierung', `${portfolio.totalDebt.toLocaleString('de-DE')} €`],
    ['Monatliche Mieteinnahmen', `${portfolio.totalMonthlyRent.toLocaleString('de-DE')} €`],
    ['Monatlicher Cashflow', `${portfolio.totalMonthlyCashflow.toLocaleString('de-DE')} €`],
    ['Durchschnittliche Rendite', `${portfolio.averageYield}%`],
    ['Durchschnittliche Cash-on-Cash', `${portfolio.averageCashOnCash}%`],
    ['Konzentrationsrisiko', portfolio.concentrationRisk],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Kennzahl', 'Wert']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    margin: { left: 14, right: 14 },
  });

  // City distribution
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Verteilung nach Städten', 14, yPos);
  yPos += 8;

  const cityData = Object.entries(portfolio.cities).map(([city, count]) => [
    city,
    count.toString(),
    `${Math.round((count / portfolio.totalProperties) * 100)}%`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Stadt', 'Anzahl', 'Anteil']],
    body: cityData,
    theme: 'striped',
    margin: { left: 14, right: 14 },
  });

  return doc.output('blob');
}
