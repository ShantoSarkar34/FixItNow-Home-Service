"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/booking-modal";
import type { Service } from "@/types";

export function BookServiceButton({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Book this service</Button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        service={service}
      />
    </>
  );
}
