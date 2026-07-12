import Link from "next/link";
import { Wrench } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const FOOTER_LINKS = {
  Company: [
    { label: "About", href: "/" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Careers", href: "/" },
  ],
  "For customers": [
    { label: "Browse services", href: "/services" },
    { label: "Browse technicians", href: "/technicians" },
    { label: "Book a service", href: "/services" },
  ],
  "For technicians": [
    { label: "Become a technician", href: "/register" },
    { label: "Technician login", href: "/login" },
  ],
  Legal: [
    { label: "Privacy policy", href: "/" },
    { label: "Terms of service", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" data-cursor-hover className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wrench className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
                FixIt<span className="text-primary">Now</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Book verified home service professionals near you — plumbers,
              electricians, cleaners, and more.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  data-cursor-hover
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-heading text-sm font-bold text-foreground">{heading}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      data-cursor-hover
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FixItNow. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, TypeScript & a lot of coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}