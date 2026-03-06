#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const cron = require('node-cron');

const CONFIG_FILE = path.join(process.env.HOME || '/root', '.blogwatcherrc');
const DEFAULT_OUTPUT_DIR = '/data/.openclaw/workspace/trending';

const parser = new Parser({
  customFields: {
    item: ['id', 'guid', 'pubDate', 'author', 'categories']
  }
});

// Feed-Kategorien
const DEFAULT_FEEDS = {
  trends: [
    { name: 'Product Hunt', url: 'https://www.producthunt.com/feed' },
    { name: 'HackerNews', url: 'https://hnrss.org/frontpage' },
    { name: 'GitHub Trending', url: 'https://github-trends.com/rss' },
    { name: 'Reddit r/startups', url: 'https://www.reddit.com/r/startups/.rss' }
  ],
  ai: [
    { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss' },
    { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss' },
    { name: 'Google AI Blog', url: 'https://ai.google/static/documents/blog-feed.xml' },
    { name: 'HuggingFace Blog', url: 'https://huggingface.co/blog/feed.xml' }
  ],
  crypto: [
    { name: 'Polymarket Blog', url: 'https://polymarket.medium.com/feed' },
    { name: 'CryptoPanic', url: 'https://cryptopanic.com/feeds/rss/' },
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss' },
    { name: 'TheBlock', url: 'https://www.theblock.co/rss.xml' }
  ],
  tech: [
    { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/' },
    { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/' },
    { name: 'Dev.to RSS', url: 'https://dev.to/feed' },
    { name: 'Medium Programming', url: 'https://medium.com/feed/tag/programming' }
  ],
  kit: [
    { name: 'KIT News', url: 'https://www.kit.edu/kitnews/feed.php' },
    { name: 'Studentenwerk Karlsruhe', url: 'https://www.sw-ka.de/de/rss/' },
    { name: 'Praxisbörse KIT', url: 'https://www.scc.kit.edu/rss/' }
  ]
};

async function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return { feeds: DEFAULT_FEEDS, checkInterval: '0 * * * *', outputDir: DEFAULT_OUTPUT_DIR };
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  return { ...{ feeds: DEFAULT_FEEDS, checkInterval: '0 * * * *', outputDir: DEFAULT_OUTPUT_DIR }, ...config };
}

async function fetchFeed(feed) {
  try {
    const content = await parser.parseURL(feed.url);
    return {
      name: feed.name,
      url: feed.url,
      items: content.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        author: item.author || item.creator,
        contentSnippet: item.contentSnippet,
        guid: item.guid || item.id
      }))
    };
  } catch (err) {
    return { name: feed.name, url: feed.url, error: err.message };
  }
}

async function checkFeeds(category = null) {
  const config = await loadConfig();
  const outputDir = config.outputDir;
  
  // Output-Dir erstellen
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const categories = category ? [category] : Object.keys(config.feeds);
  const results = {};
  const allItems = [];

  for (const cat of categories) {
    const feeds = config.feeds[cat] || [];
    console.log(`\n📰 Checking ${cat} feeds...`);
    results[cat] = [];

    for (const feed of feeds) {
      console.log(`  → ${feed.name}`);
      const result = await fetchFeed(feed);
      results[cat].push(result);
      
      if (result.items) {
        result.items.forEach(item => {
          allItems.push({
            category: cat,
            source: feed.name,
            ...item
          });
        });
      }
    }
  }

  // JSON Export
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonFile = path.join(outputDir, `feed-check-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Saved to ${jsonFile}`);

  // Latest items export
  const latestFile = path.join(outputDir, 'latest.json');
  fs.writeFileSync(latestFile, JSON.stringify(allItems, null, 2));
  console.log(`📄 Latest items: ${latestFile}`);

  // Summary
  console.log('\n📊 Summary:');
  for (const cat of categories) {
    const feedCount = results[cat].length;
    const itemCount = results[cat].reduce((sum, f) => sum + (f.items ? f.items.length : 0), 0);
    const errorCount = results[cat].filter(f => f.error).length;
    console.log(`  ${cat}: ${feedCount} feeds, ${itemCount} items, ${errorCount} errors`);
  }

  return { results, allItems };
}

async function initConfig() {
  const config = {
    feeds: DEFAULT_FEEDS,
    checkInterval: '0 * * * *', // Stündlich
    outputDir: DEFAULT_OUTPUT_DIR
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log(`✅ Config created: ${CONFIG_FILE}`);
  return config;
}

async function startWatcher() {
  const config = await loadConfig();
  console.log('👀 Starting blogwatcher...');
  console.log(`   Interval: ${config.checkInterval}`);
  console.log(`   Output: ${config.outputDir}`);

  // Erster Check
  await checkFeeds();

  // Cron Job
  cron.schedule(config.checkInterval, async () => {
    console.log(`\n⏰ [${new Date().toISOString()}] Scheduled check...`);
    await checkFeeds();
  });

  console.log('✅ Blogwatcher running. Press Ctrl+C to stop.');
}

// CLI Commands
const command = process.argv[2];

(async () => {
  switch (command) {
    case 'init':
      await initConfig();
      break;
    case 'check':
      const category = process.argv[3];
      await checkFeeds(category || null);
      break;
    case 'watch':
      await startWatcher();
      break;
    case 'config':
      const config = await loadConfig();
      console.log(JSON.stringify(config, null, 2));
      break;
    case 'version':
      console.log('blogwatcher v1.0.0');
      break;
    default:
      console.log(`
📰 blogwatcher - RSS Feed Monitor

Usage:
  blogwatcher init     - Create default config
  blogwatcher check    - Run feed check now
  blogwatcher check <category> - Check specific category
  blogwatcher watch    - Start continuous monitoring
  blogwatcher config   - Show current config
  blogwatcher version  - Show version

Categories: trends, ai, crypto, tech, kit
`);
  }
})();
