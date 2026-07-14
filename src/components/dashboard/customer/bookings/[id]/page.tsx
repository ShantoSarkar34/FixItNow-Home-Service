import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Clock, FileText } from "lucide-react";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/ui/status-badge";
import { PayNowButton } from "@/components/booking/pay-now-button";
import { ReviewForm } from "@/components/booking/review-form";
import { CancelBookingButton } from "@/components/booking/cancel-booking-button";
import type { Booking } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fixitnow-server.onrender.com";

async function getBooking(id: string): Promise<Booking | null> {
  const cookieHeader = (await headers()).get("cookie") ?? "";
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 401 || res.status === 403)
    return null;
  if (!res.ok) throw new Error("Failed to load booking");
  const json = await res.json();
  return json.data as Booking;
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) notFound();

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
        <p className="mt-1 text-sm text-muted-foreground">
          with {booking.technician?.user?.name}
        </p>

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

        {(booking.status === "PENDING" ||
          (booking.status === "ACCEPTED" && !booking.payment)) && (
          <div className="mt-4 flex gap-2 border-t border-border pt-4">
            {booking.status === "PENDING" && (
              <CancelBookingButton bookingId={booking.id} />
            )}
            {booking.status === "ACCEPTED" && !booking.payment && (
              <PayNowButton bookingId={booking.id} />
            )}
          </div>
        )}
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

      {booking.status === "COMPLETED" && !booking.review && (
        <div className="mt-4">
          <ReviewForm bookingId={booking.id} />
        </div>
      )}

      {booking.review && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="font-heading text-sm font-bold text-foreground">
            Your review
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {booking.review.comment}
          </p>
        </div>
      )}
    </div>
  );
}
