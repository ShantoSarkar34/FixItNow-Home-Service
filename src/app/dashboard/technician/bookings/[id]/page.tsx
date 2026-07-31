"use client";

import { use } from "react";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  FileSearch,
  User,
} from "lucide-react";
import { useBooking } from "@/hooks/use-booking";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/status-badge";
import { TechnicianBookingActions } from "@/components/technicians/booking-actions";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

export default function TechnicianBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading, error, refetch } = useBooking(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    const status = error instanceof ApiError ? error.status : undefined;
    const isNotFound = status === 404 || status === 403;

    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isNotFound ? "bg-muted" : "bg-destructive/10"}`}
        >
          {isNotFound ? (
            <FileSearch className="h-6 w-6 text-muted-foreground" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-destructive" />
          )}
        </div>
        <h1 className="mt-5 font-heading text-xl font-bold text-foreground">
          {isNotFound ? "Booking not found" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isNotFound
            ? "This booking doesn't exist, or it isn't assigned to you."
            : "We couldn't load this booking. Please try again."}
        </p>
        <div className="mt-6 flex gap-3">
          {!isNotFound && <Button onClick={() => refetch()}>Try again</Button>}
          <Link href="/dashboard/technician/bookings">
            <Button variant={isNotFound ? "primary" : "outline"}>
              Back to bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const price = booking.service ? parseFloat(booking.service.price) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          Booking #{booking.id}
        </h1>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <p className="font-heading text-lg font-bold text-foreground">
          {booking.service?.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {booking.customer?.name}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(booking.bookingDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
          {booking.availability && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {booking.availability.startTime} – {booking.availability.endTime}
            </div>
          )}
          {booking.address && (
            <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
              <MapPin className="h-4 w-4" />
              {booking.address}
            </div>
          )}
          {booking.note && (
            <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              {booking.note}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-heading text-lg font-bold text-foreground">
            ৳{price.toFixed(0)}
          </span>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <TechnicianBookingActions booking={booking} />
        </div>
      </div>

      {booking.payment && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="text-sm font-medium text-foreground">Payment</p>
            <p className="text-xs text-muted-foreground">
              via {booking.payment.provider}
            </p>
          </div>
          <PaymentStatusBadge status={booking.payment.status} />
        </div>
      )}

      {booking.review && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="font-heading text-sm font-bold text-foreground">
            Customer review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {booking.review.comment}
          </p>
        </div>
      )}
    </div>
  );
}
