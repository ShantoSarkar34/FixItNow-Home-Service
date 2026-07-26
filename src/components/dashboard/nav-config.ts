import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarCheck,
  UserCircle,
  Briefcase,
  Clock,
  Users,
  FolderKanban,
  ListChecks,
  WrenchIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

type NavByRole = Record<UserRole, NavLink[]>;

const customerLinks: NavLink[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/bookings", label: "My bookings", icon: CalendarCheck },
  { href: "/dashboard/customer/profile", label: "Profile", icon: UserCircle },
  { href: "/services", label: "Browse Services", icon: WrenchIcon },
  { href: "/technicians", label: "Browse Technicians", icon: Users },
];

const technicianLinks: NavLink[] = [
  { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/technician/profile", label: "My profile", icon: UserCircle },
  { href: "/dashboard/technician/services", label: "My services", icon: Briefcase },
  { href: "/dashboard/technician/availability", label: "Availability", icon: Clock },
  { href: "/dashboard/technician/bookings", label: "Bookings", icon: CalendarCheck },
];

const adminLinks: NavLink[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/categories", label: "Categories", icon: FolderKanban },
  { href: "/dashboard/admin/bookings", label: "All bookings", icon: ListChecks },
];

export const NAV_BY_ROLE: NavByRole = {
  CUSTOMER: customerLinks,
  TECHNICIAN: technicianLinks,
  ADMIN: adminLinks,
};