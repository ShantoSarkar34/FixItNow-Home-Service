import Link from "next/link";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TechnicianBookingNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <FileSearch className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="mt-5 font-heading text-xl font-bold text-foreground">
        Booking not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This booking doesn't exist, or it isn't assigned to you.
      </p>
      <Link href="/dashboard/technician/bookings" className="mt-6">
        <Button>Back to bookings</Button>
      </Link>
    </div>
  );
}
