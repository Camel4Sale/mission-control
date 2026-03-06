import { Metadata } from "next";
import { Smartphone, Rocket, Layers, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mobile Apps | Pathium",
  description: "iOS and Android apps built with React Native and Flutter. One codebase, native performance.",
};

const features = [
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "One codebase for iOS and Android. Faster development, lower costs.",
  },
  {
    icon: Rocket,
    title: "Native Performance",
    description: "Smooth 60fps animations and native-like user experience.",
  },
  {
    icon: Layers,
    title: "Code Reuse",
    description: "Share up to 90% of code between platforms while maintaining native feel.",
  },
  {
    icon: Zap,
    title: "Fast Iteration",
    description: "Hot reload and rapid prototyping for quick feedback loops.",
  },
];

const technologies = [
  "React Native",
  "Flutter",
  "iOS (Swift)",
  "Android (Kotlin)",
  "Firebase",
  "Supabase",
  "Redux",
  "GraphQL",
  "REST APIs",
  "App Store Connect",
  "Google Play Console",
  "TestFlight",
];

const process = [
  {
    step: "01",
    title: "Strategy",
    description: "Define target audience, platform priorities, and core features.",
  },
  {
    step: "02",
    title: "Design",
    description: "Mobile-first UI/UX with platform-specific guidelines (HIG, Material).",
  },
  {
    step: "03",
    title: "Build",
    description: "Agile development with weekly builds and TestFlight/Play testing.",
  },
  {
    step: "04",
    title: "Launch",
    description: "App Store submission, ASO optimization, and post-launch support.",
  },
];

export default function MobileAppsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              Mobile Apps
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              iOS + Android in One Codebase
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Native performance with React Native and Flutter. 
              Build once, deploy everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                View Our Apps
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
              Why Cross-Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Best of both worlds
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

      {/* Technologies Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern mobile development tools
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {technologies.map((tech) => (
              <div
                key={tech}
                className="px-6 py-3 bg-card rounded-full border border-border font-medium"
              >
                {tech}
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
              Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From concept to App Store
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
            Got an App Idea?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let&apos;s build something people will love to use.
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
