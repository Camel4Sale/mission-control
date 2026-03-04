'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, Battery, Sparkles, Wrench, ArrowRight, 
  Check, MapPin, Phone, Mail, Clock, Menu, X,
  Zap, Instagram, Facebook, Youtube, ChevronRight
} from 'lucide-react';

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
    description: 'Planung und Installation von maßgeschneiderten Solaranlagen für Ihr Zuhause oder Unternehmen. Wir nutzen nur hochwertige Komponenten namhafter Hersteller.',
    icon: Sun,
    features: ['Individuelle Planung', 'Hocheffiziente Module', 'Netzparallelbetrieb', 'Fördermittel-Beratung'],
    fullDescription: 'Unsere Photovoltaikanlagen werden individuell für Ihr Dach optimiert. Wir berücksichtigen dabei alle Faktoren wie Ausrichtung, Neigung, Verschattung und Ihren persönlichen Strombedarf. Dank unserer langjährigen Erfahrung und partnerships mit führenden Herstellern garantieren wir Ihnen eine Anlage mit maximaler Effizienz und Langlebigkeit.',
  },
  {
    id: 'battery',
    title: 'Batteriespeicher',
    description: 'Speichern Sie Ihren Solarstrom und werden Sie unabhängig vom Stromnetz. Mit unseren modernen Speicherlösungen maximieren Sie Ihren Eigenverbrauch.',
    icon: Battery,
    features: ['Li-Ion Technologie', 'App-Überwachung', 'Notstromfunktion', 'Skalierbare Kapazität'],
    fullDescription: 'Ein Batteriespeicher macht Sie unabhängig vom Stromnetz und erhöht Ihren Eigenverbrauch auf bis zu 80%. Unsere Lithium-Ion Speicher sind wartungsfrei, sicher und langlebig. Mit der integrierten App behalten Sie jederzeit den Überblick über Ihre Energieflüsse.',
  },
  {
    id: 'cleaning',
    title: 'Solarreinigung',
    description: 'Professionelle Reinigung für maximale Leistung Ihrer Photovoltaikanlage. Verschmutzte Module können bis zu 20% weniger Leistung erbringen.',
    icon: Sparkles,
    features: ['Kehrfreie Reinigung', 'Wartungs-service', 'Leistungsoptimierung', 'Inspektion inklusive'],
    fullDescription: 'Regelmäßige Reinigung Ihrer Solaranlage ist entscheidend für deren Leistung. Staub, Pollen, Laub und andere Verschmutzungen können den Ertrag erheblich mindern. Unsere professionelle Reinigung erfolgt schonend und ohne Chemie – für maximale Leistung und längere Lebensdauer Ihrer Anlage.',
  },
  {
    id: 'dismantle',
    title: 'Demontage',
    description: 'Fachgerechte Demontage und Entsorgung von Altanlagen. Wir kümmern uns um alles – von der Planung bis zum Recycling.',
    icon: Wrench,
    features: ['Fachgerechte Entsorgung', 'Recycling', 'Modernisierung', 'Abbau alter Module'],
    fullDescription: 'Wenn Ihre alte Solaranlage ersetzt werden soll, übernehmen wir die fachgerechte Demontage und Entsorgung. Wir sorgen für eine umweltfreundliche Recycling-Lösung und entsorgen alle Komponenten gemäß den gesetzlichen Vorgaben. Auf Wunsch planen wir auch direkt eine moderne Nachfolgelösung.',
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
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--celaris)] to-[#d97706] flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--celaris)]">Celaris Solar</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Ihr Spezialist für Solaranlagen in Karlsruhe und Umgebung.
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

export default function LeistungenPage() {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
            <Link href="/celaris" className="hover:text-[var(--celaris)]">Startseite</Link>
            <ChevronRight size={14} />
            <span className="text-[var(--text-primary)]">Leistungen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Unsere Leistungen</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl">
            Alles aus einer Hand – von der ersten Beratung bis zur regelmäßigen Wartung.
          </p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                        activeService.id === service.id
                          ? 'bg-[var(--celaris)]/10 border border-[var(--celaris)]/30'
                          : 'bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--celaris)]/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activeService.id === service.id ? 'bg-[var(--celaris)]' : 'bg-[var(--bg-tertiary)]'
                      }`}>
                        <Icon size={24} className={activeService.id === service.id ? 'text-white' : 'text-[var(--text-secondary)]'} />
                      </div>
                      <span className={`font-medium ${activeService.id === service.id ? 'text-[var(--celaris)]' : ''}`}>
                        {service.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[var(--celaris)]/10 flex items-center justify-center">
                    {(() => {
                      const Icon = activeService.icon;
                      return <Icon size={32} className="text-[var(--celaris)]" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{activeService.title}</h2>
                    <p className="text-[var(--text-secondary)]">Komplettlösungen für Ihre Bedürfnisse</p>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                  {activeService.fullDescription}
                </p>

                <h3 className="font-semibold mb-4">Was ist inbegriffen:</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {activeService.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                      <Check size={18} className="text-[var(--celaris)] shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/celaris/kontakt"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--celaris)] text-white font-medium hover:bg-[#d97706] transition-colors"
                >
                  Jetzt anfragen <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">So arbeiten wir</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Beratung', desc: 'Kostenloses Erstgespräch und Bedarfsanalyse' },
              { step: '02', title: 'Planung', desc: 'Individuelles Angebot mit professioneller Dachanalyse' },
              { step: '03', title: 'Installation', desc: 'Fachgerechte Montage durch zertifizierte Experten' },
              { step: '04', title: 'Service', desc: 'Regelmäßige Wartung und Monitoring' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--celaris)]/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-[var(--celaris)]">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-[var(--celaris)] to-[#d97706] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Fragen zu unseren Leistungen?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Rufen Sie uns an oder schreiben Sie uns eine Nachricht. Wir beraten Sie gerne kostenlos.
            </p>
            <Link
              href="/celaris/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[var(--celaris)] font-semibold hover:bg-white/90 transition-colors"
            >
              Kontakt aufnehmen
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
