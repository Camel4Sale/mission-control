import { Metadata } from "next";
import { ArrowUpRight, TrendingUp, Users, Star, Code2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio | Pathium",
  description: "Real results for real businesses. Explore our case studies and success stories.",
};

const projects = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "Complete online shopping experience with AI-powered recommendations",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    category: "Web Development",
    metrics: [
      { icon: TrendingUp, value: "€500k", label: "Revenue Increase" },
      { icon: Users, value: "50k+", label: "Monthly Users" },
    ],
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
  },
  {
    slug: "ai-chatbot",
    title: "AI Customer Support Chatbot",
    description: "Intelligent chatbot reducing support costs by 80%",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: "AI/ML",
    metrics: [
      { icon: TrendingUp, value: "80%", label: "Cost Reduction" },
      { icon: Users, value: "10k+", label: "Daily Conversations" },
    ],
    technologies: ["Python", "LLM", "FastAPI", "Vector DB"],
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    description: "Real-time analytics platform for B2B SaaS companies",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    category: "Web Development",
    metrics: [
      { icon: Users, value: "10k+", label: "Active Users" },
      { icon: Star, value: "4.9★", label: "User Rating" },
    ],
    technologies: ["React", "D3.js", "Node.js", "GraphQL"],
  },
  {
    slug: "mobile-app",
    title: "Fitness Tracking Mobile App",
    description: "Cross-platform mobile app with 4.9★ App Store rating",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    category: "Mobile Apps",
    metrics: [
      { icon: Star, value: "4.9★", label: "App Store Rating" },
      { icon: Users, value: "100k+", label: "Downloads" },
    ],
    technologies: ["React Native", "Firebase", "HealthKit", "GraphQL"],
  },
  {
    slug: "enterprise-automation",
    title: "Enterprise Process Automation",
    description: "End-to-end automation platform for enterprise workflows",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    category: "AI/ML",
    metrics: [
      { icon: TrendingUp, value: "90%", label: "Process Automation" },
      { icon: Code2, value: "200+", label: "Workflows" },
    ],
    technologies: ["Python", "ML", "Kubernetes", "PostgreSQL"],
  },
  {
    slug: "fintech-app",
    title: "FinTech Mobile Banking App",
    description: "Secure mobile banking with real-time transactions",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
    category: "Mobile Apps",
    metrics: [
      { icon: Users, value: "250k+", label: "Active Users" },
      { icon: TrendingUp, value: "€2M+", label: "Daily Transactions" },
    ],
    technologies: ["Flutter", "Go", "PostgreSQL", "Redis"],
  },
];

const categories = ["All", "Web Development", "Mobile Apps", "AI/ML"];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              Our Work
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real results for real businesses. Explore how we&apos;ve helped 
              companies transform through technology.
            </p>
          </div>
        </div>
      </section>

      {/* Categories (optional filter UI) */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-card hover:shadow-xl transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-semibold text-sm">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-primary font-medium">
                    View case study
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let&apos;s discuss your project and create something amazing together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
