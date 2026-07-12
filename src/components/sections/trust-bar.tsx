"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ShieldCheck, CheckCircle2, Star, Clock } from "lucide-react";

const STATS = [
  { end: 500, decimals: 0, suffix: "+", label: "Verified technicians", icon: ShieldCheck },
  { end: 12, decimals: 0, suffix: "k+", label: "Jobs completed", icon: CheckCircle2 },
  { end: 4.8, decimals: 1, suffix: "", label: "Average rating", icon: Star },
  { end: 24, decimals: 0, suffix: "/7", label: "Support availability", icon: Clock },
];

function Counter({
  end,
  decimals = 0,
  suffix = "",
}: {
  end: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 1400;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
            <stat.icon className="h-5 w-5 text-primary" strokeWidth={2} />
            <p className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              <Counter end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}