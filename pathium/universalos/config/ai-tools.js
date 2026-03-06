/**
 * Pathium UniversalOS - Extended AI Marketplace
 * 30+ KI-Tools für Enterprise-Kunden
 */

const aiTools = {
  // ═══════════ EXISTING AI TOOLS ═══════════
  claude: {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    category: 'text',
    icon: '🧠',
    logoColor: '#D97757',
    description: 'Advanced AI Assistant für Text, Analyse & Code',
    model: 'claude-opus-4-5',
    pricing: 'Usage-based',
    status: 'available',
    recommended: true,
    tags: ['Text', 'Analyse', 'Code', 'Frontier']
  },
  openai: {
    id: 'openai',
    name: 'GPT-5.1',
    provider: 'OpenAI',
    category: 'text',
    icon: '🤖',
    logoColor: '#10A37F',
    description: 'General Purpose AI von OpenAI',
    model: 'gpt-5.1',
    pricing: 'Usage-based',
    status: 'available',
    recommended: true,
    tags: ['Text', 'Code', 'Frontier']
  },
  google: {
    id: 'google',
    name: 'Gemini 3',
    provider: 'Google',
    category: 'text',
    icon: '✨',
    logoColor: '#4285F4',
    description: 'Multimodales AI von Google',
    model: 'gemini-3-pro',
    pricing: 'Usage-based',
    status: 'available',
    tags: ['Multimodal', 'Frontier']
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    category: 'text',
    icon: '🌪️',
    logoColor: '#FF5A00',
    description: 'European AI Powerhouse',
    model: 'mistral-large-3',
    pricing: 'Usage-based',
    status: 'available',
    tags: ['EU', 'Text']
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    category: 'text',
    icon: '🔮',
    logoColor: '#3B82F6',
    description: 'Code & Math Specialist',
    model: 'deepseek-v3.2',
    pricing: 'Free',
    status: 'available',
    tags: ['Code', 'Math', 'Free']
  },
  whisper: {
    id: 'whisper',
    name: 'Whisper',
    provider: 'OpenAI',
    category: 'voice',
    icon: '🎙️',
    logoColor: '#10A37F',
    description: 'Speech-to-Text Transcription',
    model: 'whisper-large-v3',
    pricing: '$0.006/min',
    status: 'available',
    tags: ['Voice', 'Transcription']
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    category: 'voice',
    icon: '🔊',
    logoColor: '#EC4899',
    description: 'Realistic Voice Generation',
    model: 'turbo-v3',
    pricing: 'ab $5/Monat',
    status: 'available',
    tags: ['Voice', 'TTS']
  },

  // ═══════════ NEW AI TOOLS (10+) ═══════════
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    provider: 'Midjourney Inc.',
    category: 'image',
    icon: '🎨',
    logoColor: '#000000',
    description: 'Premium Bildgenerierung mit künstlerischer Qualität',
    model: 'v6.1',
    pricing: 'ab $10/Monat',
    status: 'available',
    recommended: true,
    new: true,
    tags: ['Bild', 'Kunst', 'Premium'],
    features: ['Photorealismus', 'Artistic Style', 'Upscaling', 'Variations']
  },
  dalle3: {
    id: 'dalle3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    category: 'image',
    icon: '🖼️',
    logoColor: '#10A37F',
    description: 'Text-zu-Bild mit präzisem Prompt-Understanding',
    model: 'dall-e-3',
    pricing: '$0.04-0.12/Bild',
    status: 'available',
    new: true,
    tags: ['Bild', 'OpenAI'],
    features: ['Text Integration', 'High Detail', 'Safety Filters']
  },
  stableDiffusion: {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    provider: 'Stability AI',
    category: 'image',
    icon: '🌈',
    logoColor: '#7C3AED',
    description: 'Open-Source Bildgenerierung mit maximaler Kontrolle',
    model: 'SDXL Turbo',
    pricing: 'Open Source / API ab $0.002/Bild',
    status: 'available',
    new: true,
    tags: ['Bild', 'Open-Source', 'Customizable'],
    features: ['Inpainting', 'Outpainting', 'ControlNet', 'LoRA']
  },
  runway: {
    id: 'runway',
    name: 'Runway',
    provider: 'Runway ML',
    category: 'video',
    icon: '🎬',
    logoColor: '#00DC82',
    description: 'AI Video-Generierung & Editing',
    model: 'Gen-3 Alpha',
    pricing: 'ab $12/Monat',
    status: 'available',
    recommended: true,
    new: true,
    tags: ['Video', 'Editing', 'Generation'],
    features: ['Text-to-Video', 'Video-to-Video', 'Motion Brush', 'Green Screen']
  },
  suno: {
    id: 'suno',
    name: 'Suno',
    provider: 'Suno AI',
    category: 'audio',
    icon: '🎵',
    logoColor: '#FF4D4D',
    description: 'AI Music-Generierung - Songs in Sekunden',
    model: 'v3.5',
    pricing: 'Free / Pro ab $8/Monat',
    status: 'available',
    new: true,
    tags: ['Musik', 'Audio', 'Generation'],
    features: ['Full Songs', 'Lyrics', 'Multiple Genres', 'Vocals']
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    category: 'search',
    icon: '🔍',
    logoColor: '#1FB8CD',
    description: 'AI-Powered Search Engine mit Quellen',
    model: 'pplx-70b-online',
    pricing: 'Free / Pro ab $20/Monat',
    status: 'available',
    recommended: true,
    new: true,
    tags: ['Search', 'Research', 'Sources'],
    features: ['Real-time Search', 'Citations', 'Follow-up Questions', 'Collections']
  },
  notionAI: {
    id: 'notion-ai',
    name: 'Notion AI',
    provider: 'Notion',
    category: 'document',
    icon: '📝',
    logoColor: '#000000',
    description: 'AI Writing Assistant in Notion',
    model: 'Notion AI',
    pricing: '$8/Monat',
    status: 'available',
    new: true,
    tags: ['Docs', 'Writing', 'Productivity'],
    features: ['Summarize', 'Translate', 'Brainstorm', 'Edit']
  },
  grammarly: {
    id: 'grammarly',
    name: 'Grammarly',
    provider: 'Grammarly Inc.',
    category: 'writing',
    icon: '✍️',
    logoColor: '#15C39A',
    description: 'AI Writing Assistant für perfekte Texte',
    model: 'GrammarlyGO',
    pricing: 'Free / Premium ab €12/Monat',
    status: 'available',
    new: true,
    tags: ['Writing', 'Grammar', 'Business'],
    features: ['Grammar Check', 'Tone Detection', 'Plagiarism', 'Rewrite']
  },
  otter: {
    id: 'otter',
    name: 'Otter.ai',
    provider: 'Otter.ai',
    category: 'transcription',
    icon: '🎤',
    logoColor: '#0084FF',
    description: 'AI Meeting Assistant & Transcription',
    model: 'Otter AI',
    pricing: 'Free / Pro ab $8.33/Monat',
    status: 'available',
    new: true,
    tags: ['Transcription', 'Meetings', 'Notes'],
    features: ['Live Transcription', 'Speaker ID', 'Summary', 'Integration']
  },
  jasper: {
    id: 'jasper',
    name: 'Jasper',
    provider: 'Jasper AI',
    category: 'marketing',
    icon: '📢',
    logoColor: '#6366F1',
    description: 'AI Content Platform für Marketing',
    model: 'Jasper Chat',
    pricing: 'ab €39/Monat',
    status: 'available',
    recommended: true,
    new: true,
    tags: ['Marketing', 'Content', 'Business'],
    features: ['Brand Voice', 'Templates', 'SEO Mode', 'Art Generation']
  },

  // ═══════════ ADDITIONAL SPECIALIZED AI TOOLS ═══════════
  routeAI: {
    id: 'route-ai',
    name: 'Route Optimizer',
    provider: 'Pathium',
    category: 'automation',
    icon: '🗺️',
    logoColor: '#F97316',
    description: 'KI-Routenoptimierung für Handwerker',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Route', 'Optimization', 'Logistics']
  },
  docAI: {
    id: 'doc-ai',
    name: 'Document AI',
    provider: 'Pathium',
    category: 'document',
    icon: '📄',
    logoColor: '#3B82F6',
    description: 'Automatische Dokumenten-Analyse',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['OCR', 'Documents', 'Extraction']
  },
  visionAI: {
    id: 'vision-ai',
    name: 'Vision AI',
    provider: 'Pathium',
    category: 'vision',
    icon: '👁️',
    logoColor: '#8B5CF6',
    description: 'Bilderkennung für Schadenanalyse',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Vision', 'Analysis', 'Images']
  },
  customerAI: {
    id: 'customer-ai',
    name: 'Customer AI',
    provider: 'Pathium',
    category: 'customer',
    icon: '💬',
    logoColor: '#22C55E',
    description: 'KI-Kundenservice & Lead-Qualifizierung',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Support', 'Leads', 'Chat']
  },
  forecastAI: {
    id: 'forecast-ai',
    name: 'Forecast AI',
    provider: 'Pathium',
    category: 'analytics',
    icon: '📊',
    logoColor: '#EAB308',
    description: 'Umsatz- & Bedarfsprognose',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Forecast', 'Analytics', 'ML']
  },
  estimateAI: {
    id: 'estimate-ai',
    name: 'Estimate AI',
    provider: 'Pathium',
    category: 'automation',
    icon: '📋',
    logoColor: '#14B8A6',
    description: 'Automatische Angebotserstellung',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Offers', 'Pricing', 'Automation']
  },
  partsAI: {
    id: 'parts-ai',
    name: 'Parts AI',
    provider: 'Pathium',
    category: 'industry',
    icon: '🔧',
    logoColor: '#6B7280',
    description: 'Autoteile-Erkennung & Preisvergleich',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Automotive', 'Parts', 'Recognition']
  },
  scheduleAI: {
    id: 'schedule-ai',
    name: 'Schedule AI',
    provider: 'Pathium',
    category: 'automation',
    icon: '📅',
    logoColor: '#EC4899',
    description: 'Intelligente Terminplanung',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Scheduling', 'Calendar', 'Optimization']
  },
  inventoryAI: {
    id: 'inventory-ai',
    name: 'Inventory AI',
    provider: 'Pathium',
    category: 'analytics',
    icon: '📦',
    logoColor: '#F59E0B',
    description: 'Lagerbestand-Optimierung',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Inventory', 'Forecast', 'Retail']
  },
  marketingAI: {
    id: 'marketing-ai',
    name: 'Marketing AI',
    provider: 'Pathium',
    category: 'marketing',
    icon: '📣',
    logoColor: '#EF4444',
    description: 'KI-Marketing-Kampagnen',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Marketing', 'Campaigns', 'Social']
  },
  voiceAI: {
    id: 'voice-ai',
    name: 'Voice AI',
    provider: 'Pathium',
    category: 'voice',
    icon: '🎙️',
    logoColor: '#8B5CF6',
    description: 'Sprachsteuerung für UniversalOS',
    pricing: 'Inklusive',
    status: 'available',
    tags: ['Voice', 'Control', 'Assistant']
  }
};

// Categories for filtering
const aiCategories = {
  all: 'Alle',
  new: '🔥 Neu 2025/26',
  text: '🧠 Frontier Models',
  vision: '👁️ Vision',
  voice: '🎙️ Voice & Audio',
  automation: '⚡ Automation',
  analytics: '📊 Analytics',
  image: '🎨 Bildgenerierung',
  customer: '💬 Kundendienst',
  document: '📄 Dokumente',
  video: '🎬 Video',
  audio: '🎵 Musik',
  search: '🔍 Search',
  writing: '✍️ Writing',
  transcription: '🎤 Transcription',
  marketing: '📢 Marketing',
  industry: '🏭 Branchen-Specific'
};

// Industry-specific bundles
const industryAIBundles = {
  elektro: ['claude', 'openai', 'route-ai', 'doc-ai', 'whisper'],
  sanitaer: ['claude', 'route-ai', 'doc-ai', 'vision-ai'],
  gastro: ['openai', 'claude', 'customer-ai', 'forecast-ai', 'vision-ai'],
  hotel: ['openai', 'customer-ai', 'forecast-ai', 'claude', 'voice-ai'],
  handwerker: ['claude', 'route-ai', 'doc-ai', 'vision-ai', 'estimate-ai'],
  automotive: ['claude', 'vision-ai', 'parts-ai', 'customer-ai'],
  beauty: ['openai', 'customer-ai', 'schedule-ai', 'marketing-ai'],
  retail: ['openai', 'inventory-ai', 'forecast-ai', 'customer-ai']
};

// Export
if (typeof window !== 'undefined') {
  window.aiTools = aiTools;
  window.aiCategories = aiCategories;
  window.industryAIBundles = industryAIBundles;
}
