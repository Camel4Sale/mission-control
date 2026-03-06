/**
 * Pathium UniversalOS - Performance Optimization Module
 * Lazy Loading, Code Splitting, Image Optimization, Cache Strategy
 */

const PerformanceOptimizer = {
  config: {
    lazyLoadThreshold: 50, // px before viewport
    imageQuality: 85,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    cacheVersion: 'v1'
  },

  /**
   * Initialize all performance optimizations
   */
  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupCodeSplitting();
    this.setupCacheStrategy();
    this.setupResourceHints();
    this.monitorPerformance();
    console.log('[Perf] Performance optimizations initialized');
  },

  /**
   * Lazy Loading for Charts and Heavy Components
   */
  setupLazyLoading() {
    // Intersection Observer for lazy loading
    const observerOptions = {
      root: null,
      rootMargin: `${this.config.lazyLoadThreshold}px`,
      threshold: 0.01
    };

    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.loadLazyElement(element);
          lazyObserver.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all lazy elements
    document.querySelectorAll('[data-lazy]').forEach(el => {
      lazyObserver.observe(el);
    });

    // Observe charts
    document.querySelectorAll('canvas[data-chart]').forEach(canvas => {
      lazyObserver.observe(canvas);
    });
  },

  /**
   * Load lazy element dynamically
   */
  async loadLazyElement(element) {
    const type = element.dataset.lazy;
    
    try {
      switch (type) {
        case 'chart':
          await this.loadChart(element);
          break;
        case 'image':
          await this.loadImage(element);
          break;
        case 'module':
          await this.loadModule(element);
          break;
        case 'component':
          await this.loadComponent(element);
          break;
      }
      element.classList.add('loaded');
    } catch (error) {
      console.error('[Perf] Failed to load lazy element:', error);
      element.classList.add('error');
    }
  },

  /**
   * Lazy load Chart.js charts
   */
  async loadChart(canvas) {
    const chartType = canvas.dataset.chartType || 'line';
    const chartData = JSON.parse(canvas.dataset.chartData || '{}');
    
    // Show skeleton loader
    canvas.parentElement.classList.add('skeleton');
    
    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
      await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
    }
    
    // Create chart
    const ctx = canvas.getContext('2d');
    new Chart(ctx, chartData);
    
    canvas.parentElement.classList.remove('skeleton');
  },

  /**
   * Lazy load images with optimization
   */
  async loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
    }
    if (srcset) {
      img.srcset = srcset;
    }
    
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  },

  /**
   * Dynamic Module Loading (Code Splitting)
   */
  async loadModule(element) {
    const modulePath = element.dataset.module;
    
    try {
      const module = await import(modulePath);
      if (element.dataset.init) {
        module[element.dataset.init]();
      }
      return module;
    } catch (error) {
      console.error('[Perf] Module load failed:', modulePath, error);
      throw error;
    }
  },

  /**
   * Load component dynamically
   */
  async loadComponent(element) {
    const componentPath = element.dataset.component;
    
    try {
      const response = await fetch(componentPath);
      const html = await response.text();
      element.innerHTML = html;
      
      // Execute scripts in loaded component
      const scripts = element.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript);
      });
    } catch (error) {
      console.error('[Perf] Component load failed:', componentPath, error);
      throw error;
    }
  },

  /**
   * Image Optimization
   */
  setupImageOptimization() {
    // Convert images to WebP/AVIF where supported
    const supportsWebP = this.checkImageSupport('image/webp');
    const supportsAVIF = this.checkImageSupport('image/avif');
    
    document.querySelectorAll('img[data-optimize]').forEach(img => {
      const baseSrc = img.dataset.src || img.src;
      
      if (supportsAVIF) {
        img.src = this.convertToFormat(baseSrc, 'avif');
        img.type = 'image/avif';
      } else if (supportsWebP) {
        img.src = this.convertToFormat(baseSrc, 'webp');
        img.type = 'image/webp';
      }
    });
  },

  /**
   * Check browser image format support
   */
  checkImageSupport(format) {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL(format).indexOf(`data:${format}`) === 0;
    }
    return false;
  },

  /**
   * Convert image URL to different format
   */
  convertToFormat(url, format) {
    return url.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
  },

  /**
   * Code Splitting - Dynamic imports
   */
  setupCodeSplitting() {
    // Preload critical chunks
    this.preloadCriticalChunks();
    
    // Setup route-based splitting
    window.loadSection = async (sectionId) => {
      const sectionMap = {
        'dashboard': null, // Already loaded
        'integrationen': '/modules/integrations-hub.js',
        'ki-markt': '/modules/ai-marketplace.js',
        'benchmarks': '/modules/benchmarks.js',
        'automationen': '/modules/automation.js'
      };
      
      const modulePath = sectionMap[sectionId];
      if (modulePath) {
        await this.loadModule({ dataset: { module: modulePath } });
      }
    };
  },

  /**
   * Preload critical code chunks
   */
  async preloadCriticalChunks() {
    const criticalChunks = [
      '/config/industries.js',
      '/config/integrations.js',
      '/config/ai-tools.js'
    ];
    
    criticalChunks.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = chunk;
      document.head.appendChild(link);
    });
  },

  /**
   * Load external script dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * Cache Strategy
   */
  setupCacheStrategy() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('[Perf] SW registered:', registration.scope);
          })
          .catch(error => {
            console.error('[Perf] SW registration failed:', error);
          });
      });
    }
    
    // HTTP cache headers optimization (meta tags)
    this.setCacheHeaders();
  },

  /**
   * Set cache-control meta tags
   */
  setCacheHeaders() {
    // Note: Real cache headers should be set by server
    // These are hints for browsers
    const metaCache = document.createElement('meta');
    metaCache.httpEquiv = 'Cache-Control';
    metaCache.content = 'public, max-age=31536000';
    document.head.appendChild(metaCache);
  },

  /**
   * Resource Hints (preload, prefetch, preconnect)
   */
  setupResourceHints() {
    // Preconnect to CDN
    this.addPreconnect('https://cdn.jsdelivr.net');
    this.addPreconnect('https://fonts.googleapis.com');
    this.addPreconnect('https://fonts.gstatic.com');
    
    // Prefetch likely next navigations
    this.addPrefetch('/modules/integrations-hub.js');
    this.addPrefetch('/modules/ai-marketplace.js');
  },

  /**
   * Add preconnect link
   */
  addPreconnect(href) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  /**
   * Add prefetch link
   */
  addPrefetch(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'script';
    document.head.appendChild(link);
  },

  /**
   * Performance Monitoring
   */
  monitorPerformance() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[Perf] LCP:', lastEntry.startTime.toFixed(2), 'ms');
        this.reportMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID (First Input Delay) via Interaction to Next Paint
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          console.log('[Perf] INP:', entry.duration.toFixed(2), 'ms');
          this.reportMetric('INP', entry.duration);
        });
      });
      fidObserver.observe({ entryTypes: ['event'] });
      
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('[Perf] CLS:', clsValue.toFixed(3));
        this.reportMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
    
    // Monitor page load timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domComplete - timing.domContentLoadedEventStart;
        
        console.log('[Perf] Page Load:', pageLoadTime, 'ms');
        console.log('[Perf] DOM Ready:', domReadyTime, 'ms');
        
        this.reportMetric('PageLoad', pageLoadTime);
        this.reportMetric('DOMReady', domReadyTime);
      }, 0);
    });
  },

  /**
   * Report performance metrics
   */
  reportMetric(name, value) {
    // Send to analytics endpoint if available
    if (window.universalOSAnalytics) {
      window.universalOSAnalytics.track('performance', { name, value });
    }
    
    // Store in localStorage for debugging
    const metrics = JSON.parse(localStorage.getItem('uos_perf_metrics') || '{}');
    metrics[name] = { value, timestamp: Date.now() };
    localStorage.setItem('uos_perf_metrics', JSON.stringify(metrics));
  },

  /**
   * Debounce helper
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle helper
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PerformanceOptimizer.init());
} else {
  PerformanceOptimizer.init();
}

// Export
if (typeof window !== 'undefined') {
  window.PerformanceOptimizer = PerformanceOptimizer;
}
