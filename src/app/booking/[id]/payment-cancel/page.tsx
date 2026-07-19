import { headers } from "next/headers";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PayNowButton } from "@/components/booking/pay-now-button";
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

export default async function PaymentCancelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id);
  const bookingId = Number(id);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-6 pb-32 pt-40 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Payment cancelled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {booking
            ? `Your payment for "${booking.service?.title}" wasn't completed. No charge was made.`
            : "Your payment wasn't completed. No charge was made."}
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          {!Number.isNaN(bookingId) && (
            <div className="flex-1">
              <PayNowButton bookingId={bookingId} />
            </div>
          )}
          <Link href={`/dashboard/customer/bookings/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View booking
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}