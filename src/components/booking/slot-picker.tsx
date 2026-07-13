"use client";

import { cn } from "@/lib/utils";
import type { Availability } from "@/types";

function formatDateLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function SlotPicker({
  slots,
  selectedId,
  onSelect,
}: {
  slots: Availability[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const available = slots.filter((s) => s.status === "AVAILABLE");

  if (available.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        No available slots right now. Check back soon.
      </p>
    );
  }

  const grouped = available.reduce<Record<string, Availability[]>>(
    (acc, slot) => {
      const key = slot.date.slice(0, 10);
      acc[key] = acc[key] ? [...acc[key], slot] : [slot];
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, daySlots]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {formatDateLabel(date)}
          </p>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                data-cursor-hover
                onClick={() => onSelect(slot.id)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                  selectedId === slot.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50",
                )}
              >
                {slot.startTime} – {slot.endTime}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
