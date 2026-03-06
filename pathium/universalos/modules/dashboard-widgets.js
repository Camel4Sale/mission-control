/**
 * Pathium UniversalOS - Extended Dashboard Widgets
 * Neue Enterprise-Widgets mit Chart.js Visualisierung
 */

const DashboardWidgets = {
  /**
   * Revenue Forecast Widget - KI-basierte Umsatzprognose
   */
  revenueForecast: {
    id: 'revenue-forecast',
    title: '🔮 Umsatz-Prognose',
    description: 'KI-basierte Vorhersage für nächste 90 Tage',
    
    render(containerId, data = {}) {
      const ctx = document.getElementById(containerId);
      if (!ctx) return;
      
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels || ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5', 'Woche 6', 'Woche 7', 'Woche 8', 'Woche 9', 'Woche 10', 'Woche 11', 'Woche 12'],
          datasets: [
            {
              label: 'Tatsächlich',
              data: data.actual || [82, 85, 79, 88, 91, 87, 93, 96, 94, 98, 101, 105],
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34,197,94,0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Prognose',
              data: data.forecast || [null, null, null, null, null, null, null, null, 94, 98, 101, 105],
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139,92,246,0.1)',
              borderDash: [5, 5],
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': €' + context.parsed.y + 'k';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) {
                  return '€' + value + 'k';
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    calculateForecast(historicalData, days = 90) {
      // Einfache lineare Regression für Prognose
      const n = historicalData.length;
      const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
      const sumY = historicalData.reduce((sum, val) => sum + val, 0);
      const sumXY = historicalData.reduce((sum, val, i) => sum + (i * val), 0);
      const sumX2 = historicalData.reduce((sum, _, i) => sum + (i * i), 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const forecast = [];
      for (let i = n; i < n + days / 7; i++) {
        forecast.push(Math.round((slope * i + intercept) * 100) / 100);
      }
      
      return forecast;
    }
  },

  /**
   * Customer Lifetime Value Widget
   */
  customerLifetimeValue: {
    id: 'customer-ltv',
    title: '💎 Customer Lifetime Value',
    description: 'Durchschnittlicher Kundenwert über gesamte Beziehung',
    
    render(containerId, data = {}) {
      const ctx = document.getElementById(containerId);
      if (!ctx) return;
      
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.segments || ['Neu', 'Stamm', 'Premium', 'Enterprise'],
          datasets: [{
            label: 'LTV (€)',
            data: data.values || [1200, 4800, 12500, 28000],
            backgroundColor: [
              'rgba(59,130,246,0.7)',
              'rgba(34,197,94,0.7)',
              'rgba(249,115,22,0.7)',
              'rgba(139,92,246,0.7)'
            ],
            borderColor: [
              '#3B82F6',
              '#22C55E',
              '#F97316',
              '#8B5CF6'
            ],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'LTV: €' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '€' + (value / 1000) + 'k';
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    calculateLTV(avgPurchaseValue, purchaseFrequency, customerLifespan) {
      return avgPurchaseValue * purchaseFrequency * customerLifespan;
    }
  },

  /**
   * Employee Satisfaction Score Widget
   */
  employeeSatisfaction: {
    id: 'employee-satisfaction',
    title: '😊 Mitarbeiter-Zufriedenheit',
    description: 'eNPS & Zufriedenheits-Metriken',
    
    render(containerId, data = {}) {
      const ctx = document.getElementById(containerId);
      if (!ctx) return;
      
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sehr zufrieden', 'Zufrieden', 'Neutral', 'Unzufrieden'],
          datasets: [{
            data: data.scores || [45, 35, 15, 5],
            backgroundColor: [
              '#22C55E',
              '#84CC16',
              '#EAB308',
              '#EF4444'
            ],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    calculateENPS(promoters, passives, detractors, total) {
      return ((promoters - detractors) / total) * 100;
    }
  },

  /**
   * Carbon Footprint Tracker Widget
   */
  carbonFootprint: {
    id: 'carbon-footprint',
    title: '🌱 Carbon Footprint',
    description: 'CO₂-Emissionen & Nachhaltigkeits-Tracking',
    
    render(containerId, data = {}) {
      const ctx = document.getElementById(containerId);
      if (!ctx) return;
      
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels || ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
          datasets: [
            {
              label: 'CO₂ Emissionen (kg)',
              data: data.emissions || [1250, 1180, 1100, 1050, 980, 920, 890, 850, 810, 780, 750, 720],
              borderColor: '#14B8A6',
              backgroundColor: 'rgba(20,184,166,0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Ziel',
              data: Array(12).fill(800),
              borderColor: '#EF4444',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + ' kg CO₂';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value) {
                  return value + ' kg';
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    calculateCarbonFootprint(vehicleKm, electricityKwh, heatingKwh, wasteKg) {
      const vehicleFactor = 0.12; // kg CO₂ per km
      const electricityFactor = 0.4; // kg CO₂ per kWh (DE mix)
      const heatingFactor = 0.2; // kg CO₂ per kWh (gas)
      const wasteFactor = 0.5; // kg CO₂ per kg waste
      
      return (
        vehicleKm * vehicleFactor +
        electricityKwh * electricityFactor +
        heatingKwh * heatingFactor +
        wasteKg * wasteFactor
      );
    }
  }
};

// Export
if (typeof window !== 'undefined') {
  window.DashboardWidgets = DashboardWidgets;
}
