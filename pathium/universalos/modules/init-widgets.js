/**
 * Pathium UniversalOS - Initialize Extended Widgets
 * Rendert die neuen Dashboard-Widgets mit Demo-Daten
 */

function initializeExtendedWidgets() {
  console.log('[Widgets] Initializing extended dashboard widgets...');
  
  // Revenue Forecast Widget
  if (typeof DashboardWidgets !== 'undefined' && document.getElementById('revenueForecastChart')) {
    const forecastData = {
      labels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5', 'Woche 6', 'Woche 7', 'Woche 8', 'Woche 9', 'Woche 10', 'Woche 11', 'Woche 12'],
      actual: [82, 85, 79, 88, 91, 87, 93, 96, null, null, null, null],
      forecast: [null, null, null, null, null, null, null, null, 94, 98, 101, 105]
    };
    
    DashboardWidgets.revenueForecast.render('revenueForecastChart', {
      labels: forecastData.labels,
      actual: forecastData.actual,
      forecast: forecastData.forecast
    });
  }
  
  // Customer LTV Widget
  if (typeof DashboardWidgets !== 'undefined' && document.getElementById('customerLTVChart')) {
    DashboardWidgets.customerLifetimeValue.render('customerLTVChart', {
      segments: ['Neu', 'Stamm', 'Premium', 'Enterprise'],
      values: [1200, 4800, 12500, 28000]
    });
  }
  
  // Employee Satisfaction Widget
  if (typeof DashboardWidgets !== 'undefined' && document.getElementById('employeeSatisfactionChart')) {
    DashboardWidgets.employeeSatisfaction.render('employeeSatisfactionChart', {
      scores: [45, 35, 15, 5]
    });
  }
  
  // Carbon Footprint Widget
  if (typeof DashboardWidgets !== 'undefined' && document.getElementById('carbonFootprintChart')) {
    DashboardWidgets.carbonFootprint.render('carbonFootprintChart', {
      labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      emissions: [1250, 1180, 1100, 1050, 980, 920, 890, 850, 810, 780, 750, 720]
    });
  }
  
  console.log('[Widgets] Extended widgets initialized successfully');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtendedWidgets);
} else {
  // Small delay to ensure Chart.js is loaded
  setTimeout(initializeExtendedWidgets, 100);
}

// Export
if (typeof window !== 'undefined') {
  window.initializeExtendedWidgets = initializeExtendedWidgets;
}
