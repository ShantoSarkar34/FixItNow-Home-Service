import Link from "next/link";
import { Wrench } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <Link
          href="/"
          data-cursor-hover
          className="mb-10 flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            FixIt<span className="text-primary">Now</span>
          </span>
        </Link>

        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

        <div className="mt-8 max-w-sm">{children}</div>
        <div className="mt-6 max-w-sm text-sm text-muted-foreground">
          {footer}
        </div>
      </div>

      <div
        className="relative hidden overflow-hidden lg:block"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
          <p className="font-heading text-3xl font-extrabold text-white">
            Book trusted help,
            <br />
            track it end to end.
          </p>
          <p className="mt-4 max-w-xs text-sm text-white/80">
            From request to completion — see exactly where your job stands,
            every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
}
