import Link from "next/link";
import { UserX } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function TechnicianNotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-32 pt-40 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-foreground">
          Technician not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile may have been removed or the link is incorrect.
        </p>
        <Link href="/technicians" className="mt-8">
          <Button>Browse all technicians</Button>
        </Link>
      </main>
      <Footer />
    </>
  );
}