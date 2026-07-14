"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ServiceError({
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
    <>
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-32 pt-40 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't load this service. It might be a temporary issue with our
          servers.
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>
          <Link href="/services">
            <Button variant="outline">Back to services</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
