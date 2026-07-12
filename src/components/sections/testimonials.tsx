"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const TESTIMONIALS = [
  {
    quote: "Booked an electrician at 9pm for a fan that wouldn't stop sparking. He was at my door by 10am with everything sorted before lunch.",
    name: "Farhana Islam",
    role: "Homeowner, Bogra",
    rating: 5,
  },
  {
    quote: "I run a small rental property and FixItNow is the only booking tool that actually shows me a technician's real availability, not just a contact form.",
    name: "Mahmudul Hasan",
    role: "Property manager, Rajshahi",
    rating: 5,
  },
  {
    quote: "The status tracking is what sold me. I could see exactly when the cleaner accepted, when she started, and pay only once it was done.",
    name: "Sadia Rahman",
    role: "Homeowner, Natore",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Homeowners trust the process
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote className="h-6 w-6 text-primary/30" fill="currentColor" strokeWidth={0} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={
                        s < t.rating
                          ? "h-3.5 w-3.5 fill-secondary text-secondary"
                          : "h-3.5 w-3.5 fill-muted text-muted"
                      }
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}