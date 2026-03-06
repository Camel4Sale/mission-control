/**
 * Pathium UniversalOS - Extended Integrations
 * 50+ Integrationen für Enterprise-Kunden
 */

const integrations = {
  // ═══════════ EXISTING INTEGRATIONS ═══════════
  datev: {
    id: 'datev',
    name: 'DATEV',
    category: 'accounting',
    icon: '📊',
    logo: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23009FE3" width="100" height="100"/><text x="50" y="70" font-size="60" text-anchor="middle" fill="white">D</text></svg>',
    description: 'Buchhaltung, Steuer, Lohn - Deutschlands Nr. 1',
    status: 'available',
    recommended: true
  },
  lexware: {
    id: 'lexware',
    name: 'Lexware',
    category: 'accounting',
    icon: '📈',
    logo: '📈',
    description: 'Komplette Finanzbuchhaltung für KMU',
    status: 'available'
  },
  sevdesk: {
    id: 'sevdesk',
    name: 'SevDesk',
    category: 'accounting',
    icon: '🧾',
    logo: '🧾',
    description: 'Cloud-Buchhaltung einfach gemacht',
    status: 'available'
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    icon: '💬',
    logo: '💬',
    description: 'Team-Kommunikation & Collaboration',
    status: 'available',
    recommended: true
  },
  teams: {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'communication',
    icon: '👥',
    logo: '👥',
    description: 'Microsoft Collaboration Platform',
    status: 'available'
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    icon: '💳',
    logo: '💳',
    description: 'Online-Zahlungsabwicklung',
    status: 'available',
    recommended: true
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    category: 'payment',
    icon: '🅿️',
    logo: '🅿️',
    description: 'Weltweit führendes Payment-System',
    status: 'available'
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    icon: '🎯',
    logo: '🎯',
    description: 'Inbound Marketing & CRM',
    status: 'available',
    recommended: true
  },
  googlemaps: {
    id: 'googlemaps',
    name: 'Google Maps',
    category: 'logistics',
    icon: '🗺️',
    logo: '🗺️',
    description: 'Routenplanung & Geocoding',
    status: 'available',
    recommended: true
  },
  googlecalendar: {
    id: 'googlecalendar',
    name: 'Google Calendar',
    category: 'productivity',
    icon: '📅',
    logo: '📅',
    description: 'Terminverwaltung & Synchronisation',
    status: 'available'
  },

  // ═══════════ NEW INTEGRATIONS (10+) ═══════════
  zapier: {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    icon: '⚡',
    logo: '⚡',
    description: 'Automatisiere Workflows zwischen 5000+ Apps',
    status: 'available',
    recommended: true,
    features: ['5000+ Apps', 'Multi-Step Zaps', 'Conditional Logic', 'Custom Webhooks'],
    pricing: 'ab €20/Monat'
  },
  make: {
    id: 'make',
    name: 'Make.com',
    category: 'automation',
    icon: '🔗',
    logo: '🔗',
    description: 'Visuelle Automatisierungsplattform',
    status: 'available',
    recommended: true,
    features: ['Visual Builder', 'Advanced Scenarios', 'Data Transformation', 'Error Handling'],
    pricing: 'ab €9/Monat'
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    icon: '☁️',
    logo: '☁️',
    description: 'Weltmarktführer CRM & Customer Success',
    status: 'available',
    recommended: true,
    features: ['Lead Management', 'Opportunity Tracking', 'Sales Pipeline', 'Einstein AI'],
    pricing: 'ab €25/User/Monat'
  },
  pipedrive: {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    icon: '📊',
    logo: '📊',
    description: 'Sales-CRM für wachstumsorientierte Teams',
    status: 'available',
    features: ['Pipeline Management', 'Activity Tracking', 'Sales Reporting', 'LeadBooster'],
    pricing: 'ab €14/User/Monat'
  },
  xero: {
    id: 'xero',
    name: 'Xero',
    category: 'accounting',
    icon: '📉',
    logo: '📉',
    description: 'Cloud-Buchhaltung für kleine Unternehmen',
    status: 'available',
    features: ['Bank Reconciliation', 'Invoicing', 'Expense Claims', 'Payroll'],
    pricing: 'ab €12/Monat'
  },
  quickbooks: {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'accounting',
    icon: '📒',
    logo: '📒',
    description: 'Intuit Buchhaltungssoftware',
    status: 'available',
    features: ['Income Tracking', 'Expense Management', 'Tax Preparation', 'Inventory'],
    pricing: 'ab €18/Monat'
  },
  twilio: {
    id: 'twilio',
    name: 'Twilio',
    category: 'communication',
    icon: '📞',
    logo: '📞',
    description: 'Cloud Communications Platform',
    status: 'available',
    recommended: true,
    features: ['SMS API', 'Voice API', 'WhatsApp Business', 'Verify API'],
    pricing: 'Pay-as-you-go'
  },
  sendgrid: {
    id: 'sendgrid',
    name: 'SendGrid',
    category: 'communication',
    icon: '📧',
    logo: '📧',
    description: 'Email Delivery Service von Twilio',
    status: 'available',
    features: ['Transactional Email', 'Marketing Campaigns', 'Email Validation', 'Analytics'],
    pricing: 'ab €15/Monat'
  },
  mailchimp: {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'marketing',
    icon: '🐵',
    logo: '🐵',
    description: 'Marketing Automation & Email',
    status: 'available',
    features: ['Email Campaigns', 'Audience Segmentation', 'Automation', 'Landing Pages'],
    pricing: 'ab €13/Monat'
  },
  googleanalytics: {
    id: 'googleanalytics',
    name: 'Google Analytics',
    category: 'analytics',
    icon: '📊',
    logo: '📊',
    description: 'Web Analytics & Insights',
    status: 'available',
    recommended: true,
    features: ['Real-Time Data', 'User Behavior', 'Conversion Tracking', 'Custom Reports'],
    pricing: 'Kostenlos / GA4 360 ab €50k/Jahr'
  },

  // ═══════════ ADDITIONAL INTEGRATIONS ═══════════
  shopify: {
    id: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    icon: '🛍️',
    logo: '🛍️',
    description: 'E-Commerce Plattform',
    status: 'available'
  },
  woocommerce: {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    icon: '🏪',
    logo: '🏪',
    description: 'WordPress E-Commerce Plugin',
    status: 'available'
  },
  booking: {
    id: 'booking',
    name: 'Booking.com',
    category: 'industry',
    icon: '🏨',
    logo: '🏨',
    description: 'Hotel-Buchungsplattform',
    status: 'available'
  },
  airbnb: {
    id: 'airbnb',
    name: 'Airbnb',
    category: 'industry',
    icon: '🏠',
    logo: '🏠',
    description: 'Unterkunfts-Vermietung',
    status: 'available'
  },
  uber-eats: {
    id: 'uber-eats',
    name: 'Uber Eats',
    category: 'industry',
    icon: '🍔',
    logo: '🍔',
    description: 'Food Delivery Platform',
    status: 'available'
  },
  dhl: {
    id: 'dhl',
    name: 'DHL',
    category: 'logistics',
    icon: '📦',
    logo: '📦',
    description: 'Shipping & Logistics',
    status: 'available'
  },
  hermes: {
    id: 'hermes',
    name: 'Hermes',
    category: 'logistics',
    icon: '🚚',
    logo: '🚚',
    description: 'Paketversand Deutschland',
    status: 'available'
  },
  fresha: {
    id: 'fresha',
    name: 'Fresha',
    category: 'industry',
    icon: '💇',
    logo: '💇',
    description: 'Beauty & Wellness Booking',
    status: 'available'
  },
  booksy: {
    id: 'booksy',
    name: 'Booksy',
    category: 'industry',
    icon: '💅',
    logo: '💅',
    description: 'Beauty Terminbuchung',
    status: 'available'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    category: 'marketing',
    icon: '📸',
    logo: '📸',
    description: 'Social Media Marketing',
    status: 'available'
  },
  baulogin: {
    id: 'baulogin',
    name: 'Baulogin',
    category: 'industry',
    icon: '🏗️',
    logo: '🏗️',
    description: 'Baustellen-Zugangsmanagement',
    status: 'available'
  },
  tecdoc: {
    id: 'tecdoc',
    name: 'TecDoc',
    category: 'industry',
    icon: '🚗',
    logo: '🚗',
    description: 'Autoteile-Katalog',
    status: 'available'
  },
  autodoc: {
    id: 'autodoc',
    name: 'Autodoc',
    category: 'industry',
    icon: '🔧',
    logo: '🔧',
    description: 'Autoteile-Handel',
    status: 'available'
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    icon: '📝',
    logo: '📝',
    description: 'All-in-One Workspace',
    status: 'available'
  },
  trello: {
    id: 'trello',
    name: 'Trello',
    category: 'productivity',
    icon: '📋',
    logo: '📋',
    description: 'Kanban Project Management',
    status: 'available'
  },
  asana: {
    id: 'asana',
    name: 'Asana',
    category: 'productivity',
    icon: '✅',
    logo: '✅',
    description: 'Task & Project Management',
    status: 'available'
  },
  zoom: {
    id: 'zoom',
    name: 'Zoom',
    category: 'communication',
    icon: '📹',
    logo: '📹',
    description: 'Video Conferencing',
    status: 'available'
  },
  calendly: {
    id: 'calendly',
    name: 'Calendly',
    category: 'productivity',
    icon: '📆',
    logo: '📆',
    description: 'Automated Scheduling',
    status: 'available'
  },
  dropbox: {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'productivity',
    icon: '📁',
    logo: '📁',
    description: 'Cloud Storage',
    status: 'available'
  },
  onedrive: {
    id: 'onedrive',
    name: 'OneDrive',
    category: 'productivity',
    icon: '☁️',
    logo: '☁️',
    description: 'Microsoft Cloud Storage',
    status: 'available'
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'communication',
    icon: '📱',
    logo: '📱',
    description: 'Business Messaging',
    status: 'available',
    recommended: true
  }
};

// Categories for filtering
const integrationCategories = {
  all: 'Alle',
  erp: 'ERP / Software',
  crm: 'CRM',
  accounting: 'Buchhaltung',
  payment: 'Zahlung',
  communication: 'Kommunikation',
  logistics: 'Logistik & Karte',
  ecommerce: 'E-Commerce',
  productivity: 'Produktivität',
  marketing: 'Marketing',
  industry: 'Branchen-APIs',
  automation: 'Automation',
  analytics: 'Analytics'
};

// Export
if (typeof window !== 'undefined') {
  window.integrations = integrations;
  window.integrationCategories = integrationCategories;
}
