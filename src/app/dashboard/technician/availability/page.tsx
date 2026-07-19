"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Lock } from "lucide-react";
import { useTechnicianAvailability } from "@/hooks/use-technician-availability";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

interface SlotRow {
  key: string;
  date: string;
  startTime: string;
  endTime: string;
}

let rowCounter = 0;
function newRow(): SlotRow {
  rowCounter += 1;
  return { key: `new-${rowCounter}`, date: "", startTime: "", endTime: "" };
}

export default function AvailabilityPage() {
  const { data: availability, isLoading } = useTechnicianAvailability();
  const [rows, setRows] = useState<SlotRow[]>([]);
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (availability && !initialized) {
      const editable = availability
        .filter((a) => a.status === "AVAILABLE")
        .map((a) => ({
          key: `existing-${a.id}`,
          date: a.date.slice(0, 10),
          startTime: a.startTime,
          endTime: a.endTime,
        }));
      setRows(editable.length > 0 ? editable : [newRow()]);
      setInitialized(true);
    }
  }, [availability, initialized]);

  const lockedSlots =
    availability?.filter((a) => a.status !== "AVAILABLE") ?? [];

  const saveMutation = useMutation({
    mutationFn: () =>
      api.put("/api/technician/availability", {
        slots: rows
          .filter((r) => r.date && r.startTime && r.endTime)
          .map(({ date, startTime, endTime }) => ({
            date,
            startTime,
            endTime,
          })),
      }),
    onSuccess: () => {
      toast.success("Availability updated");
      queryClient.invalidateQueries({ queryKey: ["technician-availability"] });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update availability",
      ),
  });

  const updateRow = (
    key: string,
    field: keyof Omit<SlotRow, "key">,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)),
    );
  };

  const removeRow = (key: string) =>
    setRows((prev) => prev.filter((r) => r.key !== key));

  if (isLoading)
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Availability
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This replaces your entire set of open slots when saved — booked slots
        below are locked and unaffected.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 font-heading text-sm font-bold text-foreground">
          Open slots
        </p>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.key} className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(row.key, "date", e.target.value)}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="time"
                value={row.startTime}
                onChange={(e) =>
                  updateRow(row.key, "startTime", e.target.value)
                }
                className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="time"
                value={row.endTime}
                onChange={(e) => updateRow(row.key, "endTime", e.target.value)}
                className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => removeRow(row.key)}
                data-cursor-hover
                aria-label="Remove slot"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setRows((prev) => [...prev, newRow()])}
          data-cursor-hover
          className="mt-4 flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Add slot
        </button>

        <Button
          className="mt-6"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save availability"
          )}
        </Button>
      </div>

      {lockedSlots.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="font-heading text-sm font-bold text-foreground">
              Booked / locked slots
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lockedSlots.map((slot) => (
              <span
                key={slot.id}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
              >
                {new Date(slot.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {slot.startTime}–{slot.endTime} · {slot.status.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
