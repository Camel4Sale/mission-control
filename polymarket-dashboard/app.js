/**
 * Polymarket Dashboard - Interactive Logic
 * Real-time updates, navigation, and data simulation
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    currentPage: 'dashboard',
    lastUpdate: Date.now(),
    positions: [],
    recentTrades: [],
    strategies: [],
    balance: 45230,
    totalPnL: 12847.32
};

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update page title
            const titles = {
                dashboard: 'Dashboard',
                markets: 'Markets',
                strategies: 'Strategies',
                analytics: 'Analytics'
            };
            
            document.querySelector('.page-title').textContent = titles[page];
            state.currentPage = page;
            
            // Simulate page load
            simulatePageLoad(page);
        });
    });
}

function simulatePageLoad(page) {
    // Add loading animation
    const main = document.querySelector('.main-content');
    main.style.opacity = '0.5';
    
    setTimeout(() => {
        main.style.opacity = '1';
        updateTimestamp();
    }, 300);
}

// ============================================
// REAL-TIME UPDATES
// ============================================

function initRealTimeUpdates() {
    // Update P&L every 5 seconds
    setInterval(updatePnL, 5000);
    
    // Update positions every 3 seconds
    setInterval(updatePositions, 3000);
    
    // Update timestamp every minute
    setInterval(updateTimestamp, 60000);
}

function updatePnL() {
    const change = (Math.random() - 0.3) * 50; // Slight upward bias
    state.totalPnL += change;
    
    const pnlElement = document.querySelector('.hero-card.primary .hero-value');
    const changeElement = document.querySelector('.hero-card.primary .hero-change');
    
    pnlElement.textContent = formatCurrency(state.totalPnL);
    
    // Update change percentage
    const changePercent = (state.totalPnL / 70000) * 100;
    const changeIcon = change >= 0 ? '↑' : '↓';
    const changeClass = change >= 0 ? 'positive' : 'negative';
    
    changeElement.className = `hero-change ${changeClass}`;
    changeElement.innerHTML = `
        <span class="change-icon">${changeIcon}</span>
        <span>${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%</span>
        <span class="change-period">this month</span>
    `;
    
    // Animate the change
    pnlElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
        pnlElement.style.transform = 'scale(1)';
    }, 200);
}

function updatePositions() {
    const rows = document.querySelectorAll('.data-table tbody tr');
    
    rows.forEach(row => {
        const pnlCell = row.querySelector('td:nth-child(6)');
        const currentPriceCell = row.querySelector('td:nth-child(4)');
        
        if (pnlCell && currentPriceCell) {
            // Simulate price movement
            const currentPrice = parseFloat(currentPriceCell.textContent);
            const movement = (Math.random() - 0.5) * 2;
            const newPrice = Math.max(1, Math.min(99, currentPrice + movement));
            
            currentPriceCell.textContent = `${Math.round(newPrice)}¢`;
            
            // Update P&L based on price change
            const positionSize = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('$', '').replace(',', ''));
            const entryPrice = parseFloat(row.querySelector('td:nth-child(3)').textContent);
            
            const isYes = row.querySelector('.badge-yes') !== null;
            const pnl = isYes 
                ? ((newPrice - entryPrice) / entryPrice) * positionSize
                : ((entryPrice - newPrice) / entryPrice) * positionSize;
            
            pnlCell.textContent = formatCurrency(pnl);
            pnlCell.className = pnl >= 0 ? 'positive mono' : 'negative mono';
            
            // Flash effect for changes
            if (Math.abs(movement) > 1) {
                pnlCell.style.backgroundColor = pnl >= 0 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(244, 63, 94, 0.2)';
                setTimeout(() => {
                    pnlCell.style.backgroundColor = 'transparent';
                }, 500);
            }
        }
    });
}

function updateTimestamp() {
    const timestampEl = document.querySelector('.timestamp');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    timestampEl.textContent = timeStr;
    state.lastUpdate = Date.now();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    const sign = value >= 0 ? '+' : '';
    const absValue = Math.abs(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${sign}$${absValue}`;
}

function formatNumber(value) {
    return value.toLocaleString('en-US');
}

// ============================================
// INTERACTIONS
// ============================================

function initInteractions() {
    // Exit position buttons
    document.querySelectorAll('.btn-exit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const marketName = row.querySelector('.market-title').textContent;
            
            if (confirm(`Exit position for "${marketName}"?`)) {
                // Animate row removal
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    row.remove();
                    updateActivePositionsCount();
                }, 300);
            }
        });
    });
    
    // Quick Trade button
    const quickTradeBtn = document.querySelector('.btn-primary');
    quickTradeBtn.addEventListener('click', () => {
        showQuickTradeModal();
    });
    
    // Filter button
    const filterBtn = document.querySelector('.positions-panel .btn-ghost');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            showFilterOptions();
        });
    }
}

function updateActivePositionsCount() {
    const positionsCount = document.querySelectorAll('.data-table tbody tr').length;
    const countElement = document.querySelector('.hero-card:nth-child(3) .hero-value');
    countElement.textContent = positionsCount;
}

function showQuickTradeModal() {
    // Simple alert for demo - would be a modal in production
    alert('Quick Trade Modal\n\nEnter market URL or search for a market to trade.');
}

function showFilterOptions() {
    alert('Filter Options:\n\n• Category: All / Politics / Crypto / Sports / Entertainment\n• P&L: All / Profitable / Losing\n• Position Size: All / >$1000 / >$5000');
}

// ============================================
// CHART ANIMATIONS
// ============================================

function animateCharts() {
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach((bar, index) => {
        const targetHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.height = targetHeight;
        }, 100 + (index * 100));
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Quick trade
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showQuickTradeModal();
        }
        
        // Ctrl/Cmd + R: Refresh data
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshData();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            // Close any open modals
        }
    });
}

function refreshData() {
    // Simulate data refresh
    const main = document.querySelector('.main-content');
    main.style.opacity = '0.7';
    
    setTimeout(() => {
        main.style.opacity = '1';
        updateTimestamp();
        
        // Show toast notification
        showToast('Data refreshed');
    }, 500);
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: var(--space-md) var(--space-lg);
        color: var(--text-primary);
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add slideIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧊 Polymarket Dashboard initialized');
    
    initNavigation();
    initRealTimeUpdates();
    initInteractions();
    initKeyboardShortcuts();
    animateCharts();
    
    // Initial data load simulation
    setTimeout(() => {
        showToast('Connected to Polymarket');
    }, 1000);
});

// ============================================
// WEBSOCKET CONNECTION (Placeholder)
// ============================================

function initWebSocket() {
    // In production, connect to real WebSocket
    // const ws = new WebSocket('wss://api.polymarket.com/ws');
    
    // ws.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     handleRealTimeData(data);
    // };
    
    console.log('WebSocket connection ready (demo mode)');
}

function handleRealTimeData(data) {
    // Handle incoming market data
    // Update positions, prices, P&L in real-time
}

// Initialize WebSocket
initWebSocket();
