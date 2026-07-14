"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h1 className="mt-5 font-heading text-xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't load this booking. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/dashboard/customer/bookings">
          <Button variant="outline">Back to bookings</Button>
        </Link>
      </div>
    </div>
  );
}
