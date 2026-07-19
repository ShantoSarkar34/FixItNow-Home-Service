"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import { Magnetic } from "@/components/ui/magnetic";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-16"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-secondary/20 blur-2xl" />

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <Wrench className="h-6 w-6 text-white" />
        </div>

        <h2 className="relative mt-6 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to get something fixed?
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">
          Join thousands of homeowners booking trusted, verified technicians in
          minutes — or start earning as a technician on FixItNow.
        </p>

        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic>
            <Link href="/services">
              <Button
                size="lg"
                className="bg-white text-primary shadow-none hover:bg-white/90"
                data-cursor-text="Book"
              >
                Book a service
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Become a technician
              </Button>
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
