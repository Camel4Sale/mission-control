import cron from 'node-cron';
import { scraper } from './scraper';
import PropertyAnalyzer from './analyzer';
import AlertService from './alert-service';
import { ScraperConfig } from './scraper';
import { Deal } from '../types';

interface SchedulerConfig {
  scraperConfig: ScraperConfig;
  analyzerConfig: {
    openaiApiKey: string;
  };
  alertConfig: {
    smtpConfig?: any;
    twilioConfig?: any;
  };
}

interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

class DealFinderScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private analyzer: PropertyAnalyzer;
  private alertService: AlertService;
  private scraperConfig: ScraperConfig;
  private deals: Map<string, Deal> = new Map();

  constructor(config: SchedulerConfig) {
    this.scraperConfig = config.scraperConfig;
    this.analyzer = new PropertyAnalyzer(config.analyzerConfig);
    this.alertService = new AlertService(config.alertConfig);

    this.initializeTasks();
  }

  private initializeTasks(): void {
    // Task 1: Scrape properties every 15 minutes
    this.registerTask({
      id: 'scrape-properties',
      name: 'Property Scraper',
      cronExpression: '*/15 * * * *', // Every 15 minutes
      enabled: true,
    });

    // Task 2: Send daily digest at 8 AM
    this.registerTask({
      id: 'daily-digest',
      name: 'Daily Email Digest',
      cronExpression: '0 8 * * *', // 8 AM daily
      enabled: true,
    });

    // Task 3: Analyze new properties every 30 minutes
    this.registerTask({
      id: 'analyze-properties',
      name: 'AI Property Analysis',
      cronExpression: '*/30 * * * *', // Every 30 minutes
      enabled: true,
    });

    // Task 4: Clean old data weekly
    this.registerTask({
      id: 'cleanup-data',
      name: 'Data Cleanup',
      cronExpression: '0 3 * * 0', // 3 AM every Sunday
      enabled: true,
    });
  }

  private registerTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);

    if (task.enabled) {
      cron.schedule(task.cronExpression, async () => {
        console.log(`[Scheduler] Running task: ${task.name}`);
        await this.executeTask(task.id);
        task.lastRun = new Date();
        task.nextRun = this.calculateNextRun(task.cronExpression);
      });

      task.nextRun = this.calculateNextRun(task.cronExpression);
      console.log(`[Scheduler] Registered: ${task.name} (${task.cronExpression})`);
    }
  }

  private calculateNextRun(cronExpression: string): Date {
    // Simple next run calculation
    // In production, use a library like 'cron-parser'
    return new Date(Date.now() + 15 * 60 * 1000); // Default: 15 minutes
  }

  private async executeTask(taskId: string): Promise<void> {
    switch (taskId) {
      case 'scrape-properties':
        await this.runScraper();
        break;
      case 'analyze-properties':
        await this.runAnalyzer();
        break;
      case 'daily-digest':
        await this.runDailyDigest();
        break;
      case 'cleanup-data':
        await this.runCleanup();
        break;
    }
  }

  private async runScraper(): Promise<void> {
    console.log('[Scraper] Starting property scrape...');
    
    try {
      const result = await scraper.scrapeAllSources(this.scraperConfig);
      
      console.log(`[Scraper] Found ${result.properties.length} properties`);
      
      // Store properties as deals
      for (const property of result.properties) {
        if (!this.deals.has(property.id)) {
          const deal: Deal = {
            ...property,
            status: 'neu',
            notes: [],
            isFavorite: false,
            tags: [],
          };
          this.deals.set(property.id, deal);
          
          // Send instant alert for new deals
          await this.sendInstantAlerts(deal);
        }
      }

      if (result.errors.length > 0) {
        console.error('[Scraper] Errors:', result.errors);
      }
    } catch (error) {
      console.error('[Scraper] Failed:', error);
    }
  }

  private async runAnalyzer(): Promise<void> {
    console.log('[Analyzer] Analyzing properties...');
    
    const unanalyzedDeals = Array.from(this.deals.values()).filter(
      deal => deal.status === 'neu' && !deal.analysis
    );

    for (const deal of unanalyzedDeals) {
      try {
        const analyzedDeal = await this.analyzer.analyzeDeal(deal);
        this.deals.set(analyzedDeal.id, analyzedDeal);
        
        // Send alert if it's a good deal
        if (analyzedDeal.analysis?.priceRecommendation === 'schnaeppchen' ||
            analyzedDeal.analysis?.potentialScore >= 70) {
          await this.sendInstantAlerts(analyzedDeal);
        }
      } catch (error) {
        console.error(`[Analyzer] Failed for ${deal.id}:`, error);
      }
    }

    console.log(`[Analyzer] Analyzed ${unanalyzedDeals.length} properties`);
  }

  private async runDailyDigest(): Promise<void> {
    console.log('[Scheduler] Sending daily digest...');
    
    // Get today's new deals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDeals = Array.from(this.deals.values()).filter(
      deal => new Date(deal.createdAt) >= today
    );

    if (todayDeals.length === 0) {
      console.log('[Scheduler] No deals for today\'s digest');
      return;
    }

    // In production, get user configs from database
    // For now, this is a placeholder
    console.log(`[Scheduler] Would send digest with ${todayDeals.length} deals`);
  }

  private async runCleanup(): Promise<void> {
    console.log('[Scheduler] Running cleanup...');
    
    // Remove deals older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let removed = 0;
    for (const [id, deal] of this.deals.entries()) {
      if (new Date(deal.createdAt) < thirtyDaysAgo && deal.status !== 'kauf') {
        this.deals.delete(id);
        removed++;
      }
    }

    console.log(`[Scheduler] Removed ${removed} old deals`);
  }

  private async sendInstantAlerts(deal: Deal): Promise<void> {
    // In production, get user alert configs from database
    // For now, this is a placeholder
    console.log(`[Alerts] Would send instant alert for deal: ${deal.id}`);
  }

  getTaskStatus(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  getDeals(): Deal[] {
    return Array.from(this.deals.values());
  }

  getDeal(id: string): Deal | undefined {
    return this.deals.get(id);
  }

  updateDeal(deal: Deal): void {
    this.deals.set(deal.id, deal);
  }

  async start(): Promise<void> {
    console.log('[Scheduler] Starting Deal-Finder Scheduler...');
    await scraper.initialize();
    console.log('[Scheduler] Scraper initialized');
    
    // Run initial scrape
    await this.runScraper();
  }

  async stop(): Promise<void> {
    console.log('[Scheduler] Stopping...');
    await scraper.close();
    
    // Clear all cron jobs
    cron.getTasks().forEach(task => {
      task.stop();
    });
    
    console.log('[Scheduler] Stopped');
  }
}

export default DealFinderScheduler;

// CLI execution
if (require.main === module) {
  const config = {
    scraperConfig: {
      zipCodes: ['10115', '10117', '10119', '10178', '10179'], // Berlin
      minPrice: 500,
      maxPrice: 2000,
      minSize: 40,
      maxSize: 120,
    },
    analyzerConfig: {
      openaiApiKey: process.env.OPENAI_API_KEY || '',
    },
    alertConfig: {
      smtpConfig: process.env.SMTP_CONFIG ? JSON.parse(process.env.SMTP_CONFIG) : undefined,
      twilioConfig: process.env.TWILIO_CONFIG ? JSON.parse(process.env.TWILIO_CONFIG) : undefined,
    },
  };

  const scheduler = new DealFinderScheduler(config);
  
  scheduler.start().catch(console.error);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await scheduler.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await scheduler.stop();
    process.exit(0);
  });
}
