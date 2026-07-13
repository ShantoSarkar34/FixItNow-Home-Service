"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

export function PayNowButton({ bookingId }: { bookingId: number }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { checkoutUrl } = await api.post<{ checkoutUrl: string }>(
        "/api/payments/create",
        {
          bookingId,
        },
      );
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't start payment",
      );
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      Pay now
    </Button>
  );
}
