"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/booking-modal";
import { useSession } from "@/hooks/use-session";
import type { Service } from "@/types";

export function BookServiceButton({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (isLoading) return;

    if (!user) {
      toast.info("Please log in to book a service");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "CUSTOMER") {
      toast.error("Only customer accounts can book services");
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick} disabled={isLoading}>
        Book this service
      </Button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        service={service}
      />
    </>
  );
}
