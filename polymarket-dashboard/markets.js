/**
 * Markets Page - Interactive Logic
 * Market scanning, filtering, and trading
 */

// ============================================
// STATE
// ============================================

const marketsState = {
    currentSort: 'volume',
    currentFilter: {
        category: 'all',
        endDate: 'all',
        minVolume: 0
    },
    markets: []
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Markets page initialized');
    
    initNavigation();
    initFilters();
    initSort();
    initMarketCards();
    initSearch();
    initKeyboardShortcuts();
    
    // Simulate live updates
    setInterval(updateMarketData, 3000);
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            if (page === 'dashboard') {
                window.location.href = 'index.html';
            }
        });
    });
}

// ============================================
// FILTERS & SORT
// ============================================

function initFilters() {
    const categorySelect = document.querySelector('select');
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const label = e.target.previousElementSibling?.textContent?.toLowerCase();
            
            if (label?.includes('category')) {
                marketsState.currentFilter.category = e.target.value;
            } else if (label?.includes('end')) {
                marketsState.currentFilter.endDate = e.target.value;
            } else if (label?.includes('volume')) {
                marketsState.currentFilter.minVolume = parseInt(e.target.value);
            }
            
            filterMarkets();
        });
    });
}

function initSort() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            marketsState.currentSort = btn.dataset.sort;
            sortMarkets(btn.dataset.sort);
        });
    });
}

function filterMarkets() {
    const cards = document.querySelectorAll('.market-card');
    
    cards.forEach(card => {
        const category = card.dataset.category;
        let visible = true;
        
        // Category filter
        if (marketsState.currentFilter.category !== 'all' && 
            category !== marketsState.currentFilter.category) {
            visible = false;
        }
        
        card.style.display = visible ? 'flex' : 'none';
    });
}

function sortMarkets(sortBy) {
    const grid = document.querySelector('.markets-grid');
    const cards = Array.from(document.querySelectorAll('.market-card'));
    
    cards.sort((a, b) => {
        const aStats = getMarketStats(a);
        const bStats = getMarketStats(b);
        
        switch (sortBy) {
            case 'volume':
                return bStats.volume - aStats.volume;
            case 'liquidity':
                return bStats.liquidity - aStats.liquidity;
            case 'change':
                return bStats.change - aStats.change;
            case 'ending':
                return aStats.endsIn - bStats.endsIn;
            default:
                return 0;
        }
    });
    
    cards.forEach(card => grid.appendChild(card));
}

function getMarketStats(card) {
    const stats = card.querySelectorAll('.stat-value');
    
    const parseVolume = (str) => {
        const match = str.match(/[\d.]+[KM]?/);
        if (!match) return 0;
        const value = parseFloat(match[0]);
        if (str.includes('M')) return value * 1000000;
        if (str.includes('K')) return value * 1000;
        return value;
    };
    
    const parseChange = (str) => {
        const match = str.match(/([+-]?)\s*([\d.]+)%/);
        if (!match) return 0;
        const sign = match[1] === '-' ? -1 : 1;
        return sign * parseFloat(match[2]);
    };
    
    const parseTime = (str) => {
        if (str.includes('h')) {
            const match = str.match(/(\d+)h/);
            return match ? parseInt(match[1]) : 999;
        }
        return 999;
    };
    
    return {
        volume: parseVolume(stats[0]?.textContent || '0'),
        liquidity: parseVolume(stats[1]?.textContent || '0'),
        change: parseChange(stats[2]?.textContent || '0'),
        endsIn: parseTime(stats[3]?.textContent || '')
    };
}

// ============================================
// MARKET CARDS
// ============================================

function initMarketCards() {
    const cards = document.querySelectorAll('.market-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking buttons
            if (e.target.closest('button')) return;
            
            openMarketModal(card);
        });
    });
}

function openMarketModal(card) {
    const modal = document.getElementById('marketModal');
    const content = modal.querySelector('.modal-content');
    
    // Get market data from card
    const title = card.querySelector('h3').textContent;
    const emoji = card.querySelector('.market-emoji').textContent;
    const category = card.querySelector('.market-category').textContent;
    const stats = card.querySelectorAll('.stat');
    const prices = card.querySelectorAll('.option-price');
    
    // Build modal content
    content.innerHTML = `
        <div class="market-detail">
            <div class="market-detail-header">
                <div class="market-detail-emoji">${emoji}</div>
                <div class="market-detail-info">
                    <div class="market-detail-category">${category}</div>
                    <h2 class="market-detail-title">${title}</h2>
                </div>
            </div>
            
            <div class="market-detail-chart">
                <div class="chart-header">
                    <span>24h Price Chart</span>
                    <div class="chart-timeframe">
                        <button class="timeframe-btn active">1H</button>
                        <button class="timeframe-btn">24H</button>
                        <button class="timeframe-btn">7D</button>
                        <button class="timeframe-btn">30D</button>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="priceChart"></canvas>
                </div>
            </div>
            
            <div class="market-detail-prices">
                <div class="price-card">
                    <div class="price-card-header">
                        <span class="price-label">YES</span>
                        <span class="price-value">${prices[0]?.textContent || '50¢'}</span>
                    </div>
                    <div class="price-card-bar">
                        <div class="price-bar-fill" style="width: ${parseInt(prices[0]?.textContent) || 50}%"></div>
                    </div>
                    <button class="btn btn-yes">Buy YES</button>
                </div>
                
                <div class="price-card">
                    <div class="price-card-header">
                        <span class="price-label">NO</span>
                        <span class="price-value">${prices[1]?.textContent || '50¢'}</span>
                    </div>
                    <div class="price-card-bar">
                        <div class="price-bar-fill" style="width: ${parseInt(prices[1]?.textContent) || 50}%"></div>
                    </div>
                    <button class="btn btn-no">Buy NO</button>
                </div>
            </div>
            
            <div class="market-detail-stats">
                ${Array.from(stats).map(stat => `
                    <div class="detail-stat">
                        <span class="detail-stat-label">${stat.querySelector('.stat-label').textContent}</span>
                        <span class="detail-stat-value">${stat.querySelector('.stat-value').textContent}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="market-detail-orderbook">
                <h4>Order Book</h4>
                <div class="orderbook-grid">
                    <div class="orderbook-side">
                        <div class="orderbook-header">Bids</div>
                        <div class="orderbook-row">
                            <span>67¢</span>
                            <span>$2,340</span>
                        </div>
                        <div class="orderbook-row">
                            <span>66¢</span>
                            <span>$4,120</span>
                        </div>
                        <div class="orderbook-row">
                            <span>65¢</span>
                            <span>$8,450</span>
                        </div>
                    </div>
                    <div class="orderbook-side">
                        <div class="orderbook-header">Asks</div>
                        <div class="orderbook-row">
                            <span>69¢</span>
                            <span>$1,890</span>
                        </div>
                        <div class="orderbook-row">
                            <span>70¢</span>
                            <span>$3,240</span>
                        </div>
                        <div class="orderbook-row">
                            <span>71¢</span>
                            <span>$5,670</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Initialize chart
    initPriceChart();
}

function closeModal() {
    const modal = document.getElementById('marketModal');
    modal.classList.remove('active');
}

// Close modal on overlay click
document.getElementById('marketModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'marketModal') {
        closeModal();
    }
});

// ============================================
// PRICE CHART
// ============================================

function initPriceChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    // Generate random chart data
    const data = [];
    let price = 50;
    for (let i = 0; i < 24; i++) {
        price += (Math.random() - 0.5) * 10;
        price = Math.max(10, Math.min(90, price));
        data.push(price);
    }
    
    // Draw chart
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 20;
    
    ctx.clearRect(0, 0, width, height);
    
    // Grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * i / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Price line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((price, i) => {
        const x = padding + (width - 2 * padding) * i / (data.length - 1);
        const y = padding + (height - 2 * padding) * (1 - (price - 10) / 80);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
}

// ============================================
// SEARCH
// ============================================

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.market-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.querySelector('.market-category').textContent.toLowerCase();
            
            const matches = title.includes(query) || category.includes(query);
            card.style.display = matches ? 'flex' : 'none';
        });
    });
}

// ============================================
// LIVE UPDATES
// ============================================

function updateMarketData() {
    const cards = document.querySelectorAll('.market-card');
    
    cards.forEach(card => {
        const priceElements = card.querySelectorAll('.option-price');
        const bars = card.querySelectorAll('.bar-fill');
        const changeElement = card.querySelector('.stat-value.positive, .stat-value.negative');
        
        // Update prices
        priceElements.forEach((priceEl, i) => {
            const currentPrice = parseInt(priceEl.textContent);
            const change = Math.floor((Math.random() - 0.5) * 4);
            const newPrice = Math.max(1, Math.min(99, currentPrice + change));
            
            priceEl.textContent = `${newPrice}¢`;
            
            // Update corresponding bar
            if (bars[i]) {
                bars[i].style.width = `${newPrice}%`;
            }
        });
        
        // Flash effect for significant changes
        if (Math.abs(change) > 2) {
            card.style.borderColor = change > 0 
                ? 'rgba(16, 185, 129, 0.5)' 
                : 'rgba(244, 63, 94, 0.5)';
            
            setTimeout(() => {
                card.style.borderColor = '';
            }, 500);
        }
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
        
        // Escape: Close modal
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Expose closeModal globally
window.closeModal = closeModal;
