import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Property, ScraperResult } from '../types';

interface ScraperConfig {
  zipCodes: string[];
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  rooms?: number;
}

class PropertyScraper {
  private browser: Browser | null = null;
  private readonly sources = {
    immoscout24: 'https://www.immobilienscout24.de',
    immowelt: 'https://www.immowelt.de',
    kleinanzeigen: 'https://www.kleinanzeigen.de',
  };

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeAllSources(config: ScraperConfig): Promise<ScraperResult> {
    await this.initialize();
    
    const results: Property[] = [];
    const errors: string[] = [];

    try {
      const [immoscout, immowelt, kleinanzeigen] = await Promise.allSettled([
        this.scrapeImmoScout24(config),
        this.scrapeImmowelt(config),
        this.scrapeKleinanzeigen(config),
      ]);

      if (immoscout.status === 'fulfilled') {
        results.push(...immoscout.value.properties);
        errors.push(...immoscout.value.errors);
      } else {
        errors.push(`ImmoScout24: ${immoscout.reason}`);
      }

      if (immowelt.status === 'fulfilled') {
        results.push(...immowelt.value.properties);
        errors.push(...immowelt.value.errors);
      } else {
        errors.push(`Immowelt: ${immowelt.reason}`);
      }

      if (kleinanzeigen.status === 'fulfilled') {
        results.push(...kleinanzeigen.value.properties);
        errors.push(...kleinanzeigen.value.errors);
      } else {
        errors.push(`Kleinanzeigen: ${kleinanzeigen.reason}`);
      }
    } catch (error) {
      errors.push(`General error: ${error}`);
    }

    return {
      properties: results,
      errors,
      timestamp: new Date(),
    };
  }

  private async scrapeImmoScout24(config: ScraperConfig): Promise<ScraperResult> {
    const properties: Property[] = [];
    const errors: string[] = [];

    if (!this.browser) throw new Error('Browser not initialized');

    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      for (const zipCode of config.zipCodes) {
        const url = `${this.sources.immoscout24.de}/P-${zipCode}/wohnungen-miete.html`;
        
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await page.waitForSelector('.resultlist-entry', { timeout: 10000 });

          const entries = await page.$$('.resultlist-entry');
          
          for (const entry of entries) {
            try {
              const property = await this.parseImmoScoutEntry(page, entry, zipCode);
              if (property && this.matchesFilters(property, config)) {
                properties.push(property);
              }
            } catch (err) {
              errors.push(`Parse error ImmoScout: ${err}`);
            }
          }
        } catch (err) {
          errors.push(`ImmoScout24 ZIP ${zipCode}: ${err}`);
        }
      }

      await page.close();
    } catch (error) {
      errors.push(`ImmoScout24 general: ${error}`);
    }

    return { properties, errors, timestamp: new Date() };
  }

  private async parseImmoScoutEntry(page: Page, entry: any, zipCode: string): Promise<Property | null> {
    const title = await entry.$eval('.resultlist-entry__title h2', el => el.textContent?.trim() || '');
    const priceText = await entry.$eval('.resultlist-entry__rent', el => el.textContent?.trim() || '');
    const sizeText = await entry.$eval('.resultlist-entry__data', el => el.textContent?.trim() || '');
    
    const price = this.extractPrice(priceText);
    const size = this.extractSize(sizeText);
    const rooms = this.extractRooms(sizeText);

    if (!price || !size) return null;

    return {
      id: uuidv4(),
      source: 'immoscout24',
      url: await entry.$eval('a.resultlist-entry__link', el => el.href),
      title: title || 'Immobilie',
      price,
      size,
      rooms,
      location: {
        address: '',
        city: '',
        zipCode,
        district: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async scrapeImmowelt(config: ScraperConfig): Promise<ScraperResult> {
    const properties: Property[] = [];
    const errors: string[] = [];

    if (!this.browser) throw new Error('Browser not initialized');

    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      for (const zipCode of config.zipCodes) {
        const url = `${this.sources.immowelt.de}/wohnung-mieten/${zipCode}`;
        
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await page.waitForSelector('.SearchResult-List-item', { timeout: 10000 });

          const entries = await page.$$('.SearchResult-List-item');
          
          for (const entry of entries) {
            try {
              const property = await this.parseImmoweltEntry(page, entry, zipCode);
              if (property && this.matchesFilters(property, config)) {
                properties.push(property);
              }
            } catch (err) {
              errors.push(`Parse error Immowelt: ${err}`);
            }
          }
        } catch (err) {
          errors.push(`Immowelt ZIP ${zipCode}: ${err}`);
        }
      }

      await page.close();
    } catch (error) {
      errors.push(`Immowelt general: ${error}`);
    }

    return { properties, errors, timestamp: new Date() };
  }

  private async parseImmoweltEntry(page: Page, entry: any, zipCode: string): Promise<Property | null> {
    const title = await entry.$eval('.SearchResult-Title', el => el.textContent?.trim() || '');
    const priceText = await entry.$eval('.SearchResult-Price', el => el.textContent?.trim() || '');
    const detailsText = await entry.$eval('.SearchResult-Details', el => el.textContent?.trim() || '');
    
    const price = this.extractPrice(priceText);
    const size = this.extractSize(detailsText);
    const rooms = this.extractRooms(detailsText);

    if (!price || !size) return null;

    return {
      id: uuidv4(),
      source: 'immowelt',
      url: await entry.$eval('a.SearchResult-Link', el => el.href),
      title: title || 'Immobilie',
      price,
      size,
      rooms,
      location: {
        address: '',
        city: '',
        zipCode,
        district: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async scrapeKleinanzeigen(config: ScraperConfig): Promise<ScraperResult> {
    const properties: Property[] = [];
    const errors: string[] = [];

    if (!this.browser) throw new Error('Browser not initialized');

    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      for (const zipCode of config.zipCodes) {
        const url = `${this.sources.kleinanzeigen.de}/s-wohnung-mieten/${zipCode}`;
        
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await page.waitForSelector('.aditem', { timeout: 10000 });

          const entries = await page.$$('.aditem');
          
          for (const entry of entries) {
            try {
              const property = await this.parseKleinanzeigenEntry(page, entry, zipCode);
              if (property && this.matchesFilters(property, config)) {
                properties.push(property);
              }
            } catch (err) {
              errors.push(`Parse error Kleinanzeigen: ${err}`);
            }
          }
        } catch (err) {
          errors.push(`Kleinanzeigen ZIP ${zipCode}: ${err}`);
        }
      }

      await page.close();
    } catch (error) {
      errors.push(`Kleinanzeigen general: ${error}`);
    }

    return { properties, errors, timestamp: new Date() };
  }

  private async parseKleinanzeigenEntry(page: Page, entry: any, zipCode: string): Promise<Property | null> {
    const title = await entry.$eval('.text-module-begin a', el => el.textContent?.trim() || '');
    const priceText = await entry.$eval('.aditem-main .simple', el => el.textContent?.trim() || '');
    const detailsText = await entry.$eval('.aditem-details p', el => el.textContent?.trim() || '');
    
    const price = this.extractPrice(priceText);
    const size = this.extractSize(detailsText);
    const rooms = this.extractRooms(detailsText);

    if (!price || !size) return null;

    return {
      id: uuidv4(),
      source: 'kleinanzeigen',
      url: await entry.$eval('.text-module-begin a', el => el.href),
      title: title || 'Immobilie',
      price,
      size,
      rooms,
      location: {
        address: '',
        city: '',
        zipCode,
        district: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private matchesFilters(property: Property, config: ScraperConfig): boolean {
    if (config.minPrice && property.price < config.minPrice) return false;
    if (config.maxPrice && property.price > config.maxPrice) return false;
    if (config.minSize && property.size < config.minSize) return false;
    if (config.maxSize && property.size > config.maxSize) return false;
    if (config.rooms && property.rooms && property.rooms < config.rooms) return false;
    return true;
  }

  private extractPrice(text: string): number | null {
    const match = text.match(/(\d+)[.,](\d{3})/);
    if (match) {
      return parseFloat(match[0].replace('.', '').replace(',', '.'));
    }
    const simpleMatch = text.match(/(\d+)/);
    return simpleMatch ? parseFloat(simpleMatch[1]) : null;
  }

  private extractSize(text: string): number | null {
    const match = text.match(/(\d+)[.,](\d{2})\s*m²/);
    if (match) {
      return parseFloat(match[0].replace(' m²', '').replace(',', '.'));
    }
    const simpleMatch = text.match(/(\d+)\s*m²/);
    return simpleMatch ? parseFloat(simpleMatch[1]) : null;
  }

  private extractRooms(text: string): number | null {
    const match = text.match(/(\d+)\s*Zimmer/);
    return match ? parseInt(match[1]) : null;
  }
}

// Singleton instance
export const scraper = new PropertyScraper();

// CLI execution
if (require.main === module) {
  (async () => {
    const config: ScraperConfig = {
      zipCodes: ['10115', '10117', '10119'], // Berlin Mitte example
      minPrice: 500,
      maxPrice: 2000,
      minSize: 40,
      maxSize: 120,
    };

    console.log('Starting property scrape...');
    const result = await scraper.scrapeAllSources(config);
    console.log(`Found ${result.properties.length} properties`);
    
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors);
    }

    await scraper.close();
    process.exit(0);
  })();
}

export default PropertyScraper;
