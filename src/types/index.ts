export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type AvailabilityStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  photo?: string | null;
  address?: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface Category {
  id: number;
  name: string;
  icon?: string | null;
  description?: string | null;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: string; // Decimal comes back as a string — always parseFloat()
  duration: number;
  location: string;
  isActive: boolean;
  categoryId: number;
  category?: Category;
  technicianId: number;
  technician?: TechnicianProfile;
}

export interface TechnicianProfile {
  id: number;
  userId: number;
  user?: User;
  bio?: string | null;
  experience?: string | null;
  yearsExperience?: number | null;
  location: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  services?: Service[];
  availability?: Availability[];
}

export interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

export interface Booking {
  id: number;
  status: BookingStatus;
  bookingDate: string;
  address?: string | null;
  note?: string | null;
  service?: Service;
  availability?: Availability;
  customer?: User;
  technician?: TechnicianProfile;
  payment?: Payment | null;
  review?: Review | null;
}

export interface Payment {
  id: number;
  amount: string;
  status: PaymentStatus;
  provider: "STRIPE";
}

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
}
