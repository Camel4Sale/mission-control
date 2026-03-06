import { Metadata } from "next";
import { Brain, Sparkles, Bot, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI/ML Solutions | Pathium",
  description: "LLMs, computer vision, and automation that actually work. Transform your business with practical AI.",
};

const features = [
  {
    icon: Brain,
    title: "LLM Integration",
    description: "Custom chatbots, content generation, and intelligent assistants powered by GPT, Claude, and open-source models.",
  },
  {
    icon: Sparkles,
    title: "Computer Vision",
    description: "Image recognition, object detection, and visual analysis for automation and insights.",
  },
  {
    icon: Bot,
    title: "Process Automation",
    description: "Intelligent workflows that learn and adapt, reducing manual work by up to 80%.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "ML models that forecast trends, detect anomalies, and optimize decisions.",
  },
];

const technologies = [
  "GPT-4 / GPT-4o",
  "Claude",
  "Llama",
  "Python",
  "TensorFlow",
  "PyTorch",
  "LangChain",
  "Vector Databases",
  "OpenCV",
  "Hugging Face",
  "FastAPI",
  "MLOps",
];

const useCases = [
  {
    title: "Customer Support Chatbot",
    description: "AI-powered support that handles 80% of inquiries automatically, 24/7.",
    impact: "80% cost reduction, instant responses",
  },
  {
    title: "Document Processing",
    description: "Extract, classify, and process documents automatically with AI.",
    impact: "10x faster processing, 99% accuracy",
  },
  {
    title: "Content Generation",
    description: "Scale content creation with AI that matches your brand voice.",
    impact: "100x content output, consistent quality",
  },
  {
    title: "Predictive Maintenance",
    description: "ML models that predict failures before they happen.",
    impact: "50% downtime reduction",
  },
];

export default function AIPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI/ML Solutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              LLMs That Actually Work
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Practical AI solutions that deliver real business value. 
              No hype, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Explore AI Solutions
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                See AI Projects
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
              AI Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From chatbots to computer vision
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

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI that drives measurable impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="p-8 bg-card rounded-xl border border-border"
              >
                <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {useCase.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              AI Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge tools and frameworks
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Harness AI?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let&apos;s explore how AI can transform your business.
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
