import Hero from '@/components/Hero'
import ServicesGrid from '@/components/ServicesGrid'
import PortfolioShowcase from '@/components/PortfolioShowcase'
import Testimonials from '@/components/Testimonials'
import ContactForm from '@/components/ContactForm'
import { ArrowRight, Code, Brain, Smartphone, LineChart } from 'lucide-react'

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Scalable web apps with Next.js, React & Node.js',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'iOS + Android in one codebase with React Native',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI/ML Solutions',
    description: 'LLMs, Computer Vision & Automation that work',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: LineChart,
    title: 'Tech Consulting',
    description: 'Architecture, Code-Review & Team Training',
    color: 'from-green-500 to-emerald-500',
  },
]

const portfolio = [
  {
    title: 'E-Commerce Platform',
    client: 'RetailCorp',
    result: '€500k Revenue ↑',
    description: 'Full-stack Next.js shop with 10k daily users',
    tech: ['Next.js', 'PostgreSQL', 'Stripe'],
  },
  {
    title: 'AI Customer Support',
    client: 'TechStartup',
    result: '80% Costs ↓',
    description: 'LLM-powered chatbot handling 1000+ queries/day',
    tech: ['Python', 'OpenAI', 'FastAPI'],
  },
  {
    title: 'SaaS Analytics Dashboard',
    client: 'DataCorp',
    result: '10k Users ↑',
    description: 'Real-time analytics with beautiful visualizations',
    tech: ['React', 'D3.js', 'Node.js'],
  },
]

const testimonials = [
  {
    quote: "Pathium delivered 3x faster than any agency we've worked with. The code quality is exceptional.",
    author: 'Sarah Chen',
    role: 'CEO, TechCorp',
  },
  {
    quote: "Best agency we've worked with. They actually understand both tech AND business.",
    author: 'Michael Weber',
    role: 'CTO, StartupXYZ',
  },
  {
    quote: "Our AI chatbot reduced support costs by 80%. Pathium made it look easy.",
    author: 'Lisa Müller',
    role: 'Head of Ops, ScaleUp GmbH',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Pathium</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Services</a>
            <a href="#portfolio" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Portfolio</a>
            <a href="#testimonials" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
          <a href="#contact" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Book a Call
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Services that scale</h2>
            <p className="text-slate-600 dark:text-slate-400">
              From web apps to AI solutions — we build software that grows with your business.
            </p>
          </div>
          <ServicesGrid services={services} />
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Results that speak</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Real projects. Real impact. Real revenue growth.
            </p>
          </div>
          <PortfolioShowcase projects={portfolio} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by founders</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Don't take our word for it. Here's what our clients say.
            </p>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Let's build something great</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Ready to scale your tech? Book a free 30-min consultation.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-semibold">Pathium</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Pathium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
