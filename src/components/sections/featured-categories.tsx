"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Droplet, Zap, Sparkles, PaintBucket, Wrench, Hammer, ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";

// Placeholder — swap for GET /api/categories once data-fetching layer is wired
const CATEGORIES = [
  { name: "Plumbing", icon: Droplet },
  { name: "Electrical", icon: Zap },
  { name: "Cleaning", icon: Sparkles },
  { name: "Painting", icon: PaintBucket },
  { name: "Appliance Repair", icon: Wrench },
  { name: "Carpentry", icon: Hammer },
];

export function FeaturedCategories() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Categories
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Whatever's broken, there's a pro for it
            </h2>
          </div>
          <Link
            href="/services"
            data-cursor-hover
            className="group flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <Link
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                data-cursor-hover
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}