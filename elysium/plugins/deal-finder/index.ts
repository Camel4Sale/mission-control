/**
 * Deal-Finder Pro Plugin for Elysium Platform
 * 
 * Main entry point for plugin registration
 */

import DealFinderScheduler from './src/services/scheduler';
import PropertyAnalyzer from './src/services/analyzer';
import AlertService from './src/services/alert-service';
import { scraper } from './src/services/scraper';

export interface DealFinderPluginConfig {
  // Scraper settings
  zipCodes: string[];
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  
  // AI settings
  openaiApiKey: string;
  
  // Alert settings
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
  };
  twilioConfig?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  
  // Schedule settings
  scrapeIntervalMinutes?: number;
  analyzeIntervalMinutes?: number;
}

class DealFinderPlugin {
  private scheduler: DealFinderScheduler | null = null;
  private config: DealFinderPluginConfig;
  private isRunning: boolean = false;

  constructor(config: DealFinderPluginConfig) {
    this.config = config;
  }

  /**
   * Initialize and start the plugin
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('[Deal-Finder] Plugin is already running');
      return;
    }

    console.log('[Deal-Finder] Starting plugin...');

    try {
      // Initialize scheduler
      this.scheduler = new DealFinderScheduler({
        scraperConfig: {
          zipCodes: this.config.zipCodes,
          minPrice: this.config.minPrice,
          maxPrice: this.config.maxPrice,
          minSize: this.config.minSize,
          maxSize: this.config.maxSize,
        },
        analyzerConfig: {
          openaiApiKey: this.config.openaiApiKey,
        },
        alertConfig: {
          smtpConfig: this.config.smtpConfig,
          twilioConfig: this.config.twilioConfig,
        },
      });

      await this.scheduler.start();
      this.isRunning = true;

      console.log('[Deal-Finder] Plugin started successfully');
    } catch (error) {
      console.error('[Deal-Finder] Failed to start:', error);
      throw error;
    }
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.warn('[Deal-Finder] Plugin is not running');
      return;
    }

    console.log('[Deal-Finder] Stopping plugin...');

    try {
      if (this.scheduler) {
        await this.scheduler.stop();
      }
      this.isRunning = false;
      console.log('[Deal-Finder] Plugin stopped');
    } catch (error) {
      console.error('[Deal-Finder] Error while stopping:', error);
      throw error;
    }
  }

  /**
   * Get current plugin status
   */
  getStatus(): {
    isRunning: boolean;
    dealsCount: number;
    tasks: any[];
  } {
    if (!this.scheduler) {
      return {
        isRunning: false,
        dealsCount: 0,
        tasks: [],
      };
    }

    return {
      isRunning: this.isRunning,
      dealsCount: this.scheduler.getDeals().length,
      tasks: this.scheduler.getTaskStatus(),
    };
  }

  /**
   * Trigger manual scrape
   */
  async triggerScrape(): Promise<void> {
    if (!this.scheduler) {
      throw new Error('Plugin not initialized');
    }
    console.log('[Deal-Finder] Triggering manual scrape...');
    // Would need to expose this method in scheduler
  }

  /**
   * Get all deals
   */
  getDeals() {
    return this.scheduler?.getDeals() || [];
  }

  /**
   * Get deal by ID
   */
  getDeal(id: string) {
    return this.scheduler?.getDeal(id);
  }
}

// Export plugin factory
export function createDealFinderPlugin(config: DealFinderPluginConfig): DealFinderPlugin {
  return new DealFinderPlugin(config);
}

// Export services for direct use
export {
  DealFinderScheduler,
  PropertyAnalyzer,
  AlertService,
  scraper,
};

// Export types
export * from './src/types';

// Default export
export default DealFinderPlugin;
