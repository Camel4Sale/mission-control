import { Metadata } from "next";
import { Lightbulb, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Consulting | Pathium",
  description: "Architecture reviews, technical strategy, and team training. Build systems that scale.",
};

const features = [
  {
    icon: Lightbulb,
    title: "Technical Strategy",
    description: "Roadmap planning, technology selection, and architectural decisions aligned with business goals.",
  },
  {
    icon: Target,
    title: "Architecture Review",
    description: "Deep-dive analysis of your systems with actionable recommendations for improvement.",
  },
  {
    icon: Users,
    title: "Team Training",
    description: "Workshops and hands-on training to upskill your team in modern technologies.",
  },
  {
    icon: BookOpen,
    title: "Code Review",
    description: "Comprehensive code audits focusing on quality, security, and maintainability.",
  },
];

const services = [
  {
    title: "System Architecture",
    description: "Design scalable, maintainable systems from the ground up or optimize existing architectures.",
    deliverables: [
      "Architecture documentation",
      "Technology recommendations",
      "Scalability roadmap",
      "Risk assessment",
    ],
  },
  {
    title: "Code Quality Audit",
    description: "Thorough review of your codebase with detailed feedback and improvement plan.",
    deliverables: [
      "Code quality report",
      "Security vulnerabilities",
      "Performance bottlenecks",
      "Refactoring priorities",
    ],
  },
  {
    title: "DevOps & Infrastructure",
    description: "CI/CD pipelines, cloud infrastructure, and deployment strategies.",
    deliverables: [
      "Infrastructure setup",
      "CI/CD pipelines",
      "Monitoring & alerting",
      "Cost optimization",
    ],
  },
  {
    title: "Technical Training",
    description: "Custom workshops and training sessions for your development team.",
    deliverables: [
      "Custom curriculum",
      "Hands-on exercises",
      "Best practices guide",
      "Ongoing mentorship",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Assessment",
    description: "We analyze your current systems, team, and business objectives.",
  },
  {
    step: "02",
    title: "Strategy",
    description: "Develop a tailored roadmap with clear priorities and milestones.",
  },
  {
    step: "03",
    title: "Implementation",
    description: "Hands-on support to implement recommendations and best practices.",
  },
  {
    step: "04",
    title: "Enablement",
    description: "Train your team and establish processes for long-term success.",
  },
];

export default function ConsultingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Consulting
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              Architecture That Scales
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert guidance on technology strategy, system architecture, 
              and team development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Book a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Meet Our Experts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Consulting Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert guidance when you need it most
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              What We Deliver
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Actionable insights and tangible results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 bg-card rounded-xl border border-border"
              >
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Our Approach
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Collaborative and results-driven
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative z-10">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Need Expert Guidance?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let&apos;s discuss your challenges and find the right solution.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
