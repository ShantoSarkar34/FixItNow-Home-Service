import Link from "next/link";
import { Compass } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="font-heading text-7xl font-extrabold tracking-tight text-primary/20 sm:text-8xl">
          404
        </p>
        <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Compass className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>Back home</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline">Browse services</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}