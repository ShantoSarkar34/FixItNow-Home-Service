import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus } from "@/types";

const BOOKING_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  ACCEPTED: "bg-primary/10 text-primary border-primary/20",
  IN_PROGRESS: "bg-secondary/10 text-secondary border-secondary/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
  DECLINED: "bg-destructive/10 text-destructive border-destructive/20",
  CANCELLED: "bg-muted text-muted-foreground border-border",
};

const BOOKING_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        BOOKING_STYLES[status],
      )}
    >
      {BOOKING_LABELS[status]}
    </span>
  );
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        PAYMENT_STYLES[status],
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
