"use client";

import { motion } from "framer-motion";
import { Linkedin, Github, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const team = [
  {
    name: "Alex Müller",
    role: "Co-Founder & CEO",
    bio: "Former Google engineer with 10+ years building scalable systems.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Lisa Weber",
    role: "Co-Founder & CTO",
    bio: "Ex-Meta tech lead specializing in AI/ML and distributed systems.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Jonas Schmidt",
    role: "Lead Developer",
    bio: "Full-stack expert with a passion for clean code and performance.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Maria Garcia",
    role: "AI/ML Engineer",
    bio: "PhD in Machine Learning, building intelligent systems that scale.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
];

export default function TeamGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Meet the Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The brilliant minds behind Pathium
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-colors">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>

              <div className="flex justify-center gap-3">
                <Link
                  href={member.linkedin}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href={member.github}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href={member.twitter}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
