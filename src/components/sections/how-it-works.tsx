"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Search, CalendarCheck, CreditCard, Star } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STEPS = [
  {
    n: "01",
    title: "Browse & compare",
    desc: "Search services by category, price, or location and compare verified technician profiles.",
    icon: Search,
  },
  {
    n: "02",
    title: "Book a slot",
    desc: "Pick an available time that works for you and confirm your booking instantly.",
    icon: CalendarCheck,
  },
  {
    n: "03",
    title: "Pay securely",
    desc: "Once your technician accepts, pay safely through Stripe checkout — no cash surprises.",
    icon: CreditCard,
  },
  {
    n: "04",
    title: "Rate & review",
    desc: "After the job's done, leave a review to help other homeowners choose with confidence.",
    icon: Star,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!lineRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 55%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-xl text-center"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          How it works
        </span>
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          From search to sorted, in four steps
        </h2>
      </motion.div>

      <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute top-8 left-0 hidden h-px w-full bg-border lg:block" />
        <div ref={lineRef} className="absolute top-8 left-0 hidden h-px w-full scale-x-0 bg-primary lg:block" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative flex flex-col items-start"
          >
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
              <step.icon className="h-6 w-6 text-primary" strokeWidth={2} />
              <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {step.n}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}