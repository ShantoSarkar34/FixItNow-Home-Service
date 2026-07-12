"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Star, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORY_CHIPS = ["Plumbing", "Electrical", "Cleaning", "Appliance Repair", "Painting"];

const BOOKING_STAGES = [
  { key: "PENDING", label: "Pending", dot: "bg-warning", text: "text-warning" },
  { key: "ACCEPTED", label: "Accepted", dot: "bg-primary", text: "text-primary" },
  { key: "IN_PROGRESS", label: "In progress", dot: "bg-secondary", text: "text-secondary" },
  { key: "COMPLETED", label: "Completed", dot: "bg-success", text: "text-success" },
] as const;

function LiveBookingCard() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStageIndex((i) => (i + 1) % BOOKING_STAGES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const stage = BOOKING_STAGES[stageIndex];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Back card — depth layer */}
      <div className="absolute -right-4 top-8 h-full w-full rotate-6 rounded-3xl bg-muted/70 border border-border" />

      {/* Front card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl border border-border bg-card p-6 shadow-brand"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Booking #FN-2481
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", stage.dot)} />
            <AnimatePresence mode="wait">
              <motion.span
                key={stage.key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn("text-xs font-semibold", stage.text)}
              >
                {stage.label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="my-5 flex items-center gap-3 border-y border-border py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-image:var(--gradient-brand) text-sm font-bold text-primary-foreground">
            RK
          </div>
          <div className="flex-1">
            <p className="font-heading text-sm font-bold text-foreground">Rafiq Karim</p>
            <p className="text-xs text-muted-foreground">Electrician · Bogra</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            4.9
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ceiling fan installation</p>
            <p className="text-xs text-muted-foreground">Today, 3:00 PM – 4:00 PM</p>
          </div>
          <p className="font-heading text-lg font-bold text-foreground">৳500</p>
        </div>

        {/* Progress dots */}
        <div className="mt-5 flex items-center gap-1.5">
          {BOOKING_STAGES.map((s, i) => (
            <span
              key={s.key}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-500",
                i <= stageIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating trust chip */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-5 -left-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-md"
      >
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Payments secured</span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        {/* Left column */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Verified technicians · Live booking status
            </span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Get it fixed by
            <br />
            someone who{" "}
            <span className="relative inline-block">
              <span className="relative z-10">actually shows up</span>
              <span className="absolute inset-x-0 bottom-1 h-3 -rotate-1 bg-secondary/40" />
            </span>
            .
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Browse verified plumbers, electricians, and cleaners near you. Book a slot,
            pay securely, and track every step of the job until it's done.
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
            <Button size="md" className="shrink-0">
              Search
            </Button>
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

          {/* Trust row */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["#0F6E63", "#F2934C", "#0F6E63", "#1C8F80"].map((c, i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-background"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Trusted by 2,400+ homeowners</p>
            </div>
          </div>
        </div>

        {/* Right column — signature visual */}
        <LiveBookingCard />
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>
    </section>
  );
}