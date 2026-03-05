'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, Battery, Sparkles, Wrench, ArrowRight, 
  Check, MapPin, Phone, Mail, Clock, Menu, X,
  Zap, ChevronDown, Instagram, Facebook, Youtube,
  ArrowUpRight, Star, Award, Leaf
} from 'lucide-react';

// Company Data
const companyInfo = {
  name: 'Celaris Solar',
  tagline: 'Sonnenenergie neu gedacht',
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
    description: 'Maßgeschneiderte Solaranlagen für Ihr Zuhause oder Unternehmen. Von der Planung bis zur Installation aus einer Hand.',
    icon: Sun,
    features: ['Individuelle Planung', 'Hocheffiziente Module', 'Netzparallelbetrieb', 'Fördermittel-Beratung'],
  },
  {
    id: 'battery',
    title: 'Batteriespeicher',
    description: 'Speichern Sie Ihren Solarstrom und werden Sie unabhängig vom Stromnetz. Mit intelligenter App-Steuerung.',
    icon: Battery,
    features: ['Li-Ion Technologie', 'App-Überwachung', 'Notstromfunktion', 'Skalierbare Kapazität'],
  },
  {
    id: 'cleaning',
    title: 'Solarreinigung',
    description: 'Professionelle Reinigung für maximale Leistung Ihrer Photovoltaikanlage das ganze Jahr über.',
    icon: Sparkles,
    features: ['Kehrfreie Reinigung', 'Wartungsservice', 'Leistungsoptimierung', 'Inspektion inklusive'],
  },
  {
    id: 'dismantle',
    title: 'Demontage',
    description: 'Fachgerechte Demontage und Entsorgung von Altanlagen. Recyclinggerecht und umweltbewusst.',
    icon: Wrench,
    features: ['Fachgerechte Entsorgung', 'Recycling', 'Modernisierung', 'Abbau alter Module'],
  },
];

const stats = [
  { value: '500+', label: 'Installierte Anlagen', icon: Sun },
  { value: '10+', label: 'Jahre Erfahrung', icon: Award },
  { value: '98%', label: 'Zufriedene Kunden', icon: Star },
  { value: '2.5MW', label: 'Installierte Leistung', icon: Zap },
];

const projects = [
  {
    id: 1,
    title: 'Familienhaus Karlsruhe',
    category: 'Photovoltaik + Speicher',
    size: '12 kWp',
    location: 'Karlsruhe',
  },
  {
    id: 2,
    title: 'Gewerbehalle Ettlingen',
    category: 'Photovoltaik',
    size: '50 kWp',
    location: 'Ettlingen',
  },
  {
    id: 3,
    title: 'Doppelhaus Bruchsal',
    category: 'Photovoltaik',
    size: '8 kWp',
    location: 'Bruchsal',
  },
  {
    id: 4,
    title: 'Bürogebäude Karlsruhe',
    category: 'Photovoltaik + Speicher',
    size: '25 kWp',
    location: 'Karlsruhe',
  },
];

// Mobile Menu
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 w-80 h-full bg-[var(--bg-secondary)] border-l border-[var(--border)] p-6 animate-slideInRight">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[var(--celaris-dark)] flex items-center justify-center">
              <Zap size={20} className="text-black" />
            </div>
            <span className="text-lg font-bold text-[var(--celaris)]">Celaris</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <X size={22} />
          </button>
        </div>
        <nav className="space-y-2">
          {[
            { href: '/celaris', label: 'Startseite' },
            { href: '/celaris/leistungen', label: 'Leistungen' },
            { href: '/celaris/projekte', label: 'Projekte' },
            { href: '/celaris/kontakt', label: 'Kontakt' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-4 py-3.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all ${
                pathname === item.href 
                  ? 'bg-[var(--celaris-subtle)] text-[var(--celaris)]' 
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <Link
            href="/celaris/kontakt"
            onClick={onClose}
            className="block w-full py-3.5 text-center rounded-xl bg-[var(--gradient-gold)] text-black font-semibold"
          >
            Angebot anfordern
          </Link>
        </div>
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
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border)]' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4 lg:h-20">
          <Link href="/celaris" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[var(--celaris-dark)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap size={22} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--text-primary)] leading-tight">Celaris</span>
              <span className="text-[10px] font-medium text-[var(--celaris)] tracking-widest uppercase">Solar</span>
            </div>
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
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-[var(--celaris-subtle)] text-[var(--celaris)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/celaris/kontakt"
              className="ml-4 px-5 py-2.5 rounded-xl bg-[var(--gradient-gold)] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[var(--celaris-glow)] transition-all"
            >
              Angebot anfordern
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
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
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--celaris)]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[var(--celaris-dark)] flex items-center justify-center">
                <Zap size={22} className="text-black" />
              </div>
              <div>
                <span className="text-xl font-bold text-[var(--text-primary)]">Celaris</span>
                <span className="text-xs font-medium text-[var(--celaris)] tracking-widest uppercase block">Solar</span>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
              Ihr lokaler Partner für Solarenergie in Karlsruhe. Wir machen saubere Energie einfach und zugänglich.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--celaris-subtle)] hover:text-[var(--celaris)] transition-all group">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--celaris-subtle)] hover:text-[var(--celaris)] transition-all group">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--celaris-subtle)] hover:text-[var(--celaris)] transition-all group">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-[var(--text-primary)]">Schnelllinks</h4>
            <ul className="space-y-3">
              {['Startseite', 'Leistungen', 'Projekte', 'Kontakt'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/celaris/${item.toLowerCase() === 'startseite' ? '' : item.toLowerCase()}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--celaris)]" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-5 text-[var(--text-primary)]">Leistungen</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    href="/celaris/leistungen"
                    className="text-[var(--text-secondary)] hover:text-[var(--celaris)] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--celaris)]" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-[var(--text-primary)]">Kontakt</h4>
            <ul className="space-y-4 text-sm">
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

        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} Celaris Solar. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--celaris-subtle)] border border-[var(--celaris)]/20">
            <Award size={14} className="text-[var(--celaris)]" />
            <span className="text-sm font-medium text-[var(--celaris)]">{companyInfo.garanty} Garantie</span>
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
      className="group relative p-7 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--celaris)]/40 transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-[var(--celaris-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-[var(--celaris-subtle)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} className="text-[var(--celaris)]" />
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{service.title}</h3>
        
        <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
          {service.description}
        </p>
        
        <ul className="space-y-2.5 mb-6">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--celaris)]" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Link 
          href="/celaris/leistungen"
          className="inline-flex items-center gap-2 text-[var(--celaris)] font-semibold text-sm group-hover:gap-3 transition-all"
        >
          Mehr erfahren 
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <div 
      className="group rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--celaris)]/40 transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Visual placeholder with gradient */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[var(--bg-tertiary)] via-[var(--bg-secondary)] to-[var(--celaris-subtle)] relative overflow-hidden">
        {/* Decorative sun rays */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[var(--celaris)]/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[var(--celaris)]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Sun icon */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[var(--bg-primary)]/80 backdrop-blur border border-[var(--border)] text-xs font-semibold text-[var(--celaris)]">
          {project.size}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Sun size={56} className="text-[var(--celaris)]/20 group-hover:text-[var(--celaris)]/40 transition-colors duration-500" />
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--celaris)] transition-colors">
          {project.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mb-2">{project.category}</p>
        <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm">
          <MapPin size={14} />
          {project.location}
        </div>
      </div>
    </div>
  );
}

// Stats Component
function Stats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center"
          >
            <Icon size={24} className="text-[var(--celaris)] mx-auto mb-3" />
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
            <div className="text-[var(--text-muted)] text-sm">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// Main Page Content
export default function CelarisPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-20">
        {/* Dramatic Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)]/50 to-[var(--bg-primary)]" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[var(--celaris)]/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-[var(--celaris)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--celaris-subtle)] border border-[var(--celaris)]/20 text-[var(--celaris)] text-sm font-medium mb-8 animate-fadeIn">
              <Leaf size={16} />
              Solarenergie für Karlsruhe und Umgebung
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] animate-slideUp">
              Sonnenenergie.
              <br />
              <span className="text-gradient-gold">Günstig. Sicher. Nachhaltig.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl animate-slideUp stagger-1">
              Wir planen und installieren Photovoltaikanlagen, die sich wirklich lohnen. 
              Mit {companyInfo.garanty} Garantie und persönlichem Service aus Karlsruhe.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slideUp stagger-2">
              <Link
                href="/celaris/kontakt"
                className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-xl bg-[var(--gradient-gold)] text-black font-bold hover:shadow-lg hover:shadow-[var(--celaris-glow)] transition-all hover:-translate-y-0.5"
              >
                Kostenloses Angebot
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/celaris/leistungen"
                className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-tertiary)] hover:border-[var(--celaris)]/30 transition-all"
              >
                Unsere Leistungen
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-slideUp stagger-3">
              <Stats />
            </div>
          </div>
        </div>
        
        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </section>

      {/* Services Section */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)]/30 to-[var(--bg-primary)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--celaris-subtle)] text-[var(--celaris)] text-xs font-semibold uppercase tracking-wider mb-4">
              Unsere Leistungen
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Alles aus einer Hand
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
              Von der ersten Beratung bis zur regelmäßigen Wartung – wir begleiten Sie durch den gesamten Prozess Ihrer Solarinstallation.
            </p>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[var(--celaris)]/5 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--celaris-subtle)] text-[var(--celaris)] text-xs font-semibold uppercase tracking-wider mb-6">
                Warum wir
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Ihr Vertrauen ist<br />
                <span className="text-gradient-gold">unsere Motivation</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                Wir sind Ihr lokaler Partner für Solarenergie in Karlsruhe. Mit uns erhalten Sie 
                nicht nur eine Solaranlage, sondern einen kompetenten Ansprechpartner für alle Ihre 
                Fragen rund um erneuerbare Energien.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { text: 'Lokaler Service aus Karlsruhe', icon: MapPin },
                  { text: `${companyInfo.garanty} Garantie auf alle Anlagen`, icon: Award },
                  { text: 'Fördermittel-Beratung inklusive', icon: Leaf },
                  { text: 'Persönliche Betreuung von Anfang an', icon: Star },
                  { text: 'Faire und transparente Preise', icon: Check },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <div className="w-10 h-10 rounded-lg bg-[var(--celaris-subtle)] flex items-center justify-center">
                      <item.icon size={18} className="text-[var(--celaris)]" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-[var(--celaris-subtle)] via-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] p-10 flex items-center justify-center relative overflow-hidden">
                {/* Animated rings */}
                <div className="absolute inset-10 border border-[var(--celaris)]/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-20 border border-[var(--celaris)]/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[var(--gradient-gold)] flex items-center justify-center animate-float">
                    <Zap size={48} className="text-black" />
                  </div>
                  <div className="text-6xl font-bold text-gradient-gold mb-2">{companyInfo.garanty}</div>
                  <div className="text-[var(--text-secondary)] text-lg">Jahre Garantie</div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 px-5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--success)]/20 flex items-center justify-center">
                    <Check size={18} className="text-[var(--success)]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Zertifiziert</div>
                    <div className="text-xs text-[var(--text-muted)]">DIN EN 62446</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)]/50 to-[var(--bg-primary)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--celaris-subtle)] text-[var(--celaris)] text-xs font-semibold uppercase tracking-wider mb-4">
                Referenzen
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Unsere Projekte
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl">
                Eine Auswahl unserer erfolgreich installierten Anlagen in der Region Karlsruhe.
              </p>
            </div>
            <Link
              href="/celaris/projekte"
              className="inline-flex items-center gap-2 mt-6 md:mt-0 text-[var(--celaris)] font-semibold hover:gap-3 transition-all group"
            >
              Alle Projekte ansehen 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--celaris)] via-[var(--celaris-dark)] to-[#b45309]" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bereit für Ihre eigene Solaranlage?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Vereinbaren Sie jetzt einen kostenlosen Beratungstermin. Wir prüfen Ihr Dach 
            und erstellen Ihnen ein individuelles Angebot – ohne Verpflichtung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/celaris/kontakt"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-[var(--celaris-dark)] font-bold hover:shadow-2xl hover:shadow-black/20 transition-all hover:-translate-y-1"
            >
              Jetzt Termin vereinbaren
              <ArrowRight size={20} />
            </Link>
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              <Phone size={20} />
              {companyInfo.phone}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
