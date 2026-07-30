"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  BadgeCheck,
  CalendarCheck,
  UserCheck,
  Navigation,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Avatar } from "../ui/avatar";

const CATEGORY_CHIPS = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Appliance Repair",
];

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: "Verified technicians only" },
  { icon: Star, label: "4.8 average rating" },
  { icon: CheckCircle2, label: "12,000+ jobs completed" },
];

const JOURNEY_STEPS = [
  { label: "Service booked", icon: CalendarCheck },
  { label: "Technician assigned", icon: UserCheck },
  { label: "On the way", icon: Navigation },
  { label: "Job completed", icon: CheckCircle2 },
] as const;

function JourneyComposition() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % JOURNEY_STEPS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Soft ambient glow directly behind the composition */}
      <div className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full bg-primary/10 blur-3xl" />

      {/* Main card — booking + live journey tracker */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl border border-border bg-card/80 p-6 shadow-brand backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Booking #FN-2481
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-semibold text-success">Live</span>
          </span>
        </div>

        <div className="mt-6 space-y-0">
          {JOURNEY_STEPS.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            const isLast = i === JOURNEY_STEPS.length - 1;

            return (
              <div key={s.label} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor:
                        isDone || isActive
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted))",
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  >
                    <s.icon
                      className={cn(
                        "h-3.5 w-3.5",
                        isDone || isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    />
                  </motion.div>
                  {!isLast && (
                    <div className="relative h-8 w-px bg-muted">
                      <motion.div
                        className="absolute inset-x-0 top-0 w-px bg-primary"
                        initial={{ height: 0 }}
                        animate={{ height: isDone ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 pb-8 pt-1">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : isDone
                          ? "text-foreground/80"
                          : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </p>

                  <AnimatePresence mode="wait">
                    {isActive && i === 1 && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-xs text-muted-foreground"
                      >
                        Rafiq K. · Electrician · ⭐ 4.9
                      </motion.p>
                    )}
                    {isActive && i === 2 && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-xs font-medium text-secondary"
                      >
                        Arriving in 12 min
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Floating: verified technician card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          scale: { duration: 0.5, delay: 0.3 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute -right-6 -top-10 flex items-center gap-2.5 rounded-2xl border border-border bg-card/80 px-3.5 py-3 shadow-md backdrop-blur-xl"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full">
          <Avatar
            src={"https://i.ibb.co.com/0pFLGFYF/1.jpg"}
            name="Avater"
          ></Avatar>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-xs font-semibold text-foreground">Rafiq K.</p>
            <BadgeCheck className="h-3 w-3 fill-primary text-primary-foreground" />
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 fill-secondary text-secondary"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating: secure payment badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.45 },
          scale: { duration: 0.5, delay: 0.45 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="absolute -bottom-5 -left-7 flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-3.5 py-2.5 shadow-md backdrop-blur-xl"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
          <Lock className="h-3 w-3 text-success" />
        </div>
        <span className="text-[11px] font-semibold text-foreground">
          Payments secured
        </span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobOneRef = useRef<HTMLDivElement>(null);
  const blobTwoRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollCfg = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      };
      gsap.to(blobOneRef.current, {
        y: 130,
        ease: "none",
        scrollTrigger: scrollCfg,
      });
      gsap.to(blobTwoRef.current, {
        y: -90,
        ease: "none",
        scrollTrigger: scrollCfg,
      });
      gsap.to(visualRef.current, {
        y: 70,
        ease: "none",
        scrollTrigger: scrollCfg,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-24 pb-24">
      <div
        ref={blobOneRef}
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        ref={blobTwoRef}
        className="pointer-events-none absolute top-32 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        {/* Left column */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Home Services Marketplace · Verified Pros Only
            </span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Home services,
            <br />
            <span className="bg-(image:--gradient-brand) bg-clip-text text-transparent">
              booked, verified, and tracked.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Compare trusted local professionals, book an open slot in seconds,
            and follow your job from request to completion — no guesswork, no
            surprises.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-md sm:flex-row sm:items-center sm:rounded-full">
            <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="What do you need help with?"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Bogra, Rajshahi"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <Magnetic strength={0.25}>
              <Button size="md" className="shrink-0" data-cursor-text="Go">
                Search
              </Button>
            </Magnetic>
          </div>

          {/* Primary / secondary CTAs */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/services">
                <Button size="md" data-cursor-text="Book">
                  Book a service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Magnetic>
            <Link href="/register">
              <Button size="md" variant="outline">
                Become a technician
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            {TRUST_INDICATORS.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <t.icon className="h-3.5 w-3.5 text-primary" />
                {t.label}
              </div>
            ))}
          </div>

          {/* Category chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORY_CHIPS.map((chip) => (
              <Link
                key={chip}
                href={`/services?search=${encodeURIComponent(chip)}`}
                data-cursor-hover
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {chip}
              </Link>
            ))}
          </div>
        </div>

        {/* Right column — signature journey visual */}
        <div ref={visualRef}>
          <JourneyComposition />
        </div>
      </div>
    </section>
  );
}
