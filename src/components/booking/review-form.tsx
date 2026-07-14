"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ReviewForm({ bookingId }: { bookingId: number }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const submitReview = useMutation({
    mutationFn: () =>
      api.post("/api/reviews", {
        bookingId,
        rating,
        comment: comment || undefined,
      }),
    onSuccess: () => {
      toast.success("Thanks for the feedback!");
      queryClient.invalidateQueries({
        queryKey: ["booking", String(bookingId)],
      });
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't submit review",
      ),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-heading text-sm font-bold text-foreground">
        Leave a review
      </p>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              data-cursor-hover
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(value)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hovered || rating) >= value
                    ? "fill-secondary text-secondary"
                    : "fill-muted text-muted",
                )}
              />
            </button>
          );
        })}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="How did it go?"
        className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button
        className="mt-3 w-full"
        disabled={rating === 0 || submitReview.isPending}
        onClick={() => submitReview.mutate()}
      >
        {submitReview.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit review"
        )}
      </Button>
    </div>
  );
}
