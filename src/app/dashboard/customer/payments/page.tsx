"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { usePayments } from "@/hooks/use-payments";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

const TABS: { value: PaymentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

export default function CustomerPaymentsPage() {
  const [tab, setTab] = useState<PaymentStatus | "ALL">("ALL");
  const { data: payments, isLoading } = usePayments(tab);

  const total =
    payments?.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Payment history
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A record of everything you've paid for on FixItNow.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">Total paid</p>
        <p className="mt-1 font-heading text-2xl font-extrabold text-foreground">৳{total.toFixed(0)}</p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            data-cursor-hover
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              tab === t.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading payments…</p>}

        {!isLoading && payments?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <CreditCard className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No payments in this category.</p>
          </div>
        )}

        {payments?.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                {p.booking?.service?.title ?? `Payment #${p.id}`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                via {p.provider}
                {p.bookingId && (
                  <>
                    {" · "}
                    <Link
                      href={`/dashboard/customer/bookings/${p.bookingId}`}
                      data-cursor-hover
                      className="text-primary hover:underline"
                    >
                      View booking
                    </Link>
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-sm font-bold text-foreground">
                ৳{parseFloat(p.amount).toFixed(0)}
              </p>
              <div className="mt-1">
                <PaymentStatusBadge status={p.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}