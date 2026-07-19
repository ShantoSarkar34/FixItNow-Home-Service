import { headers } from "next/headers";
import Link from "next/link";
import { CheckCircle2, Calendar, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://fixit-server.vercel.app";

async function getBooking(id: string): Promise<Booking | null> {
  const cookieHeader = (await headers()).get("cookie") ?? "";
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as Booking;
}

export default async function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-6 pb-32 pt-40 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Payment successful
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {booking
            ? `Your payment for "${booking.service?.title}" has been confirmed.`
            : "Your payment has been confirmed."}
        </p>

        {booking && (
          <div className="mt-8 w-full rounded-2xl border border-border bg-card p-5 text-left">
            <p className="font-heading text-sm font-bold text-foreground">{booking.service?.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">with {booking.technician?.user?.name}</p>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {booking.availability && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {booking.availability.startTime} – {booking.availability.endTime}
                </span>
              )}
            </div>
          </div>
        )}

        <Link href={`/dashboard/customer/bookings/${id}`} className="mt-8 w-full">
          <Button className="w-full">
            View booking
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href="/dashboard/customer/bookings"
          data-cursor-hover
          className="mt-3 text-sm text-muted-foreground hover:text-foreground"
        >
          Back to all bookings
        </Link>
      </main>
      <Footer />
    </>
  );
}