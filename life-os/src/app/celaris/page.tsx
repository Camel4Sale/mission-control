'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, Battery, Sparkles, Wrench, ArrowRight, 
  Check, MapPin, Phone, Mail, Clock, Menu, X,
  Zap, ChevronDown, Instagram, Facebook, Youtube
} from 'lucide-react';

// Company Data
const companyInfo = {
  name: 'Celaris Solar',
  slogan: 'Ihr Spezialist für Solaranlagen in Karlsruhe und Umgebung',
  address: 'Kriegsstraße 158, 76131 Karlsruhe',
  phone: '+49 800 1234567',
  email: 'info@celaris-solar.com',
  hours: 'Mo-Fr 08:00-18:00',
  garanty: '10 Jahre',
};

const services = [
  {
    id: 'pv',
    title: 'Photovoltaik',
    description: 'Planung und Installation von maßgeschneiderten Solaranlagen für Ihr Zuhause oder Unternehmen.',
    icon: Sun,
    features: ['Individuelle Planung', 'Hocheffiziente Module', 'Netzparallelbetrieb', 'Fördermittel-Beratung'],
  },
  {
    id: 'battery',
    title: 'Batteriespeicher',
    description: 'Speichern Sie Ihren Solarstrom und werden Sie unabhängig vom Stromnetz.',
    icon: Battery,
    features: ['Li-Ion Technologie', 'App-Überwachung', 'Notstromfunktion', 'Skalierbare Kapazität'],
  },
  {
    id: 'cleaning',
    title: 'Solarreinigung',
    description: 'Professionelle Reinigung für maximale Leistung Ihrer Photovoltaikanlage.',
    icon: Sparkles,
    features: ['Kehrfreie Reinigung', 'Wartungs-service', 'Leistungsoptimierung', 'Inspektion inklusive'],
  },
  {
    id: 'dismantle',
    title: 'Demontage',
    description: 'Fachgerechte Demontage und Entsorgung von Altanlagen.',
    icon: Wrench,
    features: ['Fachgerechte Entsorgung', 'Recycling', 'Modernisierung', 'Abbau alter Module'],
  },
];

const projects = [
  {
    id: 1,
    title: 'Familienhaus Karlsruhe',
    category: 'Photovoltaik + Speicher',
    size: '12 kWp',
    location: 'Karlsruhe',
    image: '/api/placeholder/400/300',
  },
  {
    id: 2,
    title: 'Gewerbehalle Ettlingen',
    category: 'Photovoltaik',
    size: '50 kWp',
    location: 'Ettlingen',
    image: '/api/placeholder/400/300',
  },
  {
    id: 3,
    title: 'Doppelhaus Bruchsal',
    category: 'Photovoltaik',
    size: '8 kWp',
    location: 'Bruchsal',
    image: '/api/placeholder/400/300',
  },
  {
    id: 4,
    title: 'Bürogebäude Karlsruhe',
    category: 'Photovoltaik + Speicher',
    size: '25 kWp',
    location: 'Karlsruhe',
    image: '/api/placeholder/400/300',
  },
];

// Mobile Menu
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 w-72 h-full bg-[var(--bg-secondary)] border-l border-[var(--border)] p-6 animate-slideUp">
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-bold text-[var(--celaris)]">Celaris Solar</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-hover)]">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          {['/', '/leistungen', '/projekte', '/kontakt'].map((href) => (
            <Link
              key={href}
              href={`/celaris${href}`}
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg ${
                pathname === `/celaris${href}` 
                  ? 'bg-[var(--celaris)]/10 text-[var(--celaris)]' 
                  : 'hover:bg-[var(--bg-hover)]'
              }`}
            >
              {href === '/' ? 'Startseite' : href === '/leistungen' ? 'Leistungen' : href === '/projekte' ? 'Projekte' : 'Kontakt'}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Header
function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-[var(--bg-secondary)]/95 backdrop-blur border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/celaris" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[#d97706] flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--celaris)]">Celaris Solar</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/celaris', label: 'Startseite' },
              { href: '/celaris/leistungen', label: 'Leistungen' },
              { href: '/celaris/projekte', label: 'Projekte' },
              { href: '/celaris/kontakt', label: 'Kontakt' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--celaris)]/10 text-[var(--celaris)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/celaris/kontakt"
              className="ml-4 px-5 py-2.5 rounded-lg bg-[var(--celaris)] text-white font-medium hover:bg-[#d97706] transition-colors"
            >
              Angebot anfordern
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)]"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[#d97706] flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--celaris)]">Celaris Solar</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Ihr Spezialist für Solaranlagen in Karlsruhe und Umgebung. Wir machen Solarenergie einfach und zugänglich.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Schnelllinks</h4>
            <ul className="space-y-2">
              {['Startseite', 'Leistungen', 'Projekte', 'Kontakt'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/celaris/${item.toLowerCase() === 'startseite' ? '' : item.toLowerCase()}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Leistungen</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    href="/celaris/leistungen"
                    className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[var(--celaris)] mt-0.5 shrink-0" />
                <span className="text-[var(--text-secondary)]">{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[var(--celaris)] shrink-0" />
                <a href={`tel:${companyInfo.phone}`} className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[var(--celaris)] shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors">
                  {companyInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-[var(--celaris)] shrink-0" />
                <span className="text-[var(--text-secondary)]">{companyInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} Celaris Solar. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <Check size={14} className="text-[var(--celaris)]" />
              {companyInfo.garanty} Garantie
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Service Card Component
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;
  
  return (
    <div 
      className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--celaris)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--celaris)]/5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 rounded-xl bg-[var(--celaris)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--celaris)]/20 transition-colors">
        <Icon size={28} className="text-[var(--celaris)]" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-5 leading-relaxed">
        {service.description}
      </p>
      <ul className="space-y-2">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Check size={14} className="text-[var(--celaris)]" />
            {feature}
          </li>
        ))}
      </ul>
      <Link 
        href="/celaris/leistungen"
        className="inline-flex items-center gap-2 mt-6 text-[var(--celaris)] font-medium text-sm hover:gap-3 transition-all"
      >
        Mehr erfahren <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--celaris)]/50 transition-all duration-300">
      <div className="aspect-video bg-[var(--bg-tertiary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun size={48} className="text-[var(--celaris)]/30" />
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--celaris)] text-white text-xs font-medium">
          {project.size}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--celaris)] transition-colors">
          {project.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">{project.category}</p>
        <div className="flex items-center gap-1 mt-2 text-[var(--text-muted)] text-sm">
          <MapPin size={14} />
          {project.location}
        </div>
      </div>
    </div>
  );
}

// Main Page Content
export default function CelarisPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--celaris)]/5" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[var(--celaris)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-[var(--celaris)]/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--celaris)]/10 border border-[var(--celaris)]/20 text-[var(--celaris)] text-sm font-medium mb-6">
              <Sun size={16} />
              Solarenergie für Karlsruhe und Umgebung
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Sonnenenergie.
              <br />
              <span className="text-[var(--celaris)]">Günstig. Sicher. Nachhaltig.</span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl">
              Wir planen und installieren Photovoltaikanlagen, die sich wirklich lohnen. 
              Mit {companyInfo.garanty} Garantie und lokalem Service aus Karlsruhe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/celaris/kontakt"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--celaris)] text-white font-semibold hover:bg-[#d97706] transition-colors"
              >
                Kostenloses Angebot
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/celaris/leistungen"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Unsere Leistungen
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {[
                { value: '500+', label: 'Installierte Anlagen' },
                { value: '10+', label: 'Jahre Erfahrung' },
                { value: '98%', label: 'Zufriedene Kunden' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-[var(--celaris)] mb-1">{stat.value}</div>
                  <div className="text-[var(--text-muted)] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Leistungen</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Alles aus einer Hand – von der Beratung bis zur Wartung Ihrer Solaranlage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Warum Celaris Solar?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                Wir sind Ihr lokaler Partner für Solarenergie in Karlsruhe. Mit uns erhalten Sie 
                nicht nur eine Solaranlage, sondern einen kompetenten Ansprechpartner für alle Ihre 
                Fragen rund um erneuerbare Energien.
              </p>
              
              <div className="space-y-4">
                {[
                  'Lokaler Service aus Karlsruhe',
                  `${companyInfo.garanty} Garantie auf alle Anlagen`,
                  'Fördermittel-Beratung inklusive',
                  'Persönliche Betreuung von Anfang an',
                  'Faire und transparente Preise',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--celaris)]/10 flex items-center justify-center">
                      <Check size={14} className="text-[var(--celaris)]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[var(--celaris)]/20 to-[var(--celaris)]/5 border border-[var(--celaris)]/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Zap size={80} className="text-[var(--celaris)] mx-auto mb-4" />
                  <div className="text-5xl font-bold text-[var(--celaris)] mb-2">10 Jahre</div>
                  <div className="text-[var(--text-secondary)]">Garantie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Projekte</h2>
              <p className="text-[var(--text-secondary)] max-w-xl">
                Eine Auswahl unserer erfolgreich installierten Anlagen in der Region.
              </p>
            </div>
            <Link
              href="/celaris/projekte"
              className="inline-flex items-center gap-2 mt-4 md:mt-0 text-[var(--celaris)] font-medium hover:gap-3 transition-all"
            >
              Alle Projekte ansehen <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[var(--celaris)] to-[#d97706] p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10" />
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Bereit für Ihre eigene Solaranlage?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Vereinbaren Sie jetzt einen kostenlosen Beratungstermin. Wir prüfen Ihr Dach 
                und erstellen Ihnen ein individuelles Angebot.
              </p>
              <Link
                href="/celaris/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[var(--celaris)] font-semibold hover:bg-white/90 transition-colors"
              >
                Jetzt Termin vereinbaren
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
