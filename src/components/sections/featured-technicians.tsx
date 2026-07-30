"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Star,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { TechnicianProfile } from "@/types";
import { api } from "@/lib/api";

const gradients = [
  "linear-gradient(135deg,#0F6E63,#1C8F80)",
  "linear-gradient(135deg,#F2934C,#E56B4F)",
  "linear-gradient(135deg,#0F6E63,#0B4F46)",
  "linear-gradient(135deg,#F2934C,#C9772E)",
  "linear-gradient(135deg,#1C8F80,#0F6E63)",
];

export function FeaturedTechnicians() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const {
    data: technicians,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["technicians", queryString],
    queryFn: () =>
      api.get<TechnicianProfile[]>(
        `/api/technicians${queryString ? `?${queryString}` : ""}`,
      ),
  });

  const scroll = (dir: "left" | "right") => {
    scrollerRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return null;
  }

  if (isError || !technicians?.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Top Rated
          </span>

          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Meet a few of our pros
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Scroll left"
            data-cursor-hover
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            aria-label="Scroll right"
            data-cursor-hover
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div
        ref={scrollerRef}
        className="pt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {technicians.map((tech, i) => (
          <motion.div
            key={tech.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="w-64 shrink-0 snap-start sm:w-72"
          >
            <Link
              href={`/technicians/${tech.id}`}
              data-cursor-hover
              className={cn(
                "group block rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:border-primary/40 hover:shadow-brand",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{
                    backgroundImage: gradients[i % gradients.length],
                  }}
                >
                  {tech?.user?.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="truncate font-heading text-sm font-bold text-foreground">
                      {tech.user?.name}
                    </p>

                    {tech.isVerified && (
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-primary text-primary-foreground" />
                    )}
                  </div>

                  <p className="truncate text-xs text-muted-foreground">
                    {tech.services?.length
                      ? tech.services
                          .map((service) => service.category?.name)
                          .join(", ")
                      : "General Service"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{tech.location}</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />

                  {tech.averageRating.toFixed(1)}

                  <span className="font-normal text-muted-foreground">
                    • {tech.yearsExperience} yrs
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
