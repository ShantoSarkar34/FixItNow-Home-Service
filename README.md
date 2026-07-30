<div align="center">

# 🛠️ FixItNow

**A full-stack home services marketplace — book verified plumbers, electricians, and cleaners in minutes.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)](https://stripe.com/)

[Live Demo](#) · [Report a Bug](#) · [Request a Feature](#)

</div>

---

![FixItNow Hero Screenshot](/public/images/screenshorts/hero.png)

## 📖 Overview

**FixItNow** connects homeowners with verified home-service technicians — plumbers, electricians, cleaners, and more. Customers browse services, book a technician's available time slot, pay securely through Stripe, and track the job in real time from request to completion. Technicians manage their own profile, services, and availability, and respond to booking requests through a dedicated dashboard.

The platform has three roles, each with a purpose-built dashboard:

| Role | Can do |
|---|---|
| 👤 **Customer** | Browse services & technicians, book a slot, pay via Stripe, track booking status, leave a review |
| 🔧 **Technician** | Manage profile, list services, publish availability, accept/decline/progress bookings |
| 🛡️ **Admin** | Manage users (ban/unban), manage service categories, oversee all platform bookings |

---

## ✨ Features

- 🔐 **Cookie-based authentication** with automatic access-token refresh
- 🔍 **Filterable service & technician discovery** — category, location, price, search — all URL-synced
- 📅 **Real-time booking state machine** — `Pending → Accepted → In Progress → Completed`
- 💳 **Stripe Checkout integration** for secure payments
- ⭐ **Reviews & ratings** that recalculate technician averages automatically
- 📊 **Admin analytics dashboard** with charts (booking trends, status breakdown, user distribution, top categories)
- 🌗 **Full dark/light theme support**
- 🖱️ **Custom animated cursor** with contextual hover states
- 🎬 **Scroll-driven animations** powered by GSAP + Lenis smooth scroll
- 📱 **Fully responsive** — including a dedicated mobile dashboard navigation drawer
- 🧭 **Graceful error handling** — custom 404 and error boundaries on every dynamic route

---

## 📸 Screenshots

<div align="center">

### Browse Services
![Browse Services](/public/images/screenshorts/service.png)

### Booking Flow
![Booking Flow](/public/images/screenshorts/how-to-work.png)

### Customer Dashboard
![Customer Dashboard](/public/images/screenshorts/customer-profile.png)

### Technician Dashboard
![Technician Dashboard](/public/images/screenshorts/technician-profile.png)

### Admin Analytics
![Admin Dashboard](/public/images/screenshorts/admin-profile.png)


</div>

---

## 🧰 Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion), GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Data Fetching / Cache | TanStack Query |
| Forms & Validation | React Hook Form + Zod |
| Global State | Zustand |
| Charts | Recharts |
| Notifications | Sonner |
| Icons | Lucide React |
| Deployment | Vercel |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Language | TypeScript (ESM) |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | JWT via httpOnly cookies |
| Payments | Stripe |
| Deployment | Vercel |

---

## 🗂️ Project Structure

```
src/
├── app/                      # Next.js App Router routes
│   ├── dashboard/            # Role-based dashboards (customer/technician/admin)
│   ├── services/              # Public service browsing & detail pages
│   ├── technicians/           # Public technician browsing & detail pages
│   ├── booking/                # Payment success/cancel redirect pages
│   ├── login/ · register/     # Auth pages
│   └── not-found.tsx           # Global 404
├── components/
│   ├── booking/               # Booking modal, slot picker, review form, payment
│   ├── dashboard/             # Sidebar, mobile nav, nav config
│   ├── layout/                 # Navbar, footer, user menu
│   ├── sections/               # Landing page sections
│   ├── services/ · technicians/ # Cards, filters, skeletons
│   └── ui/                     # Reusable primitives (Button, Dialog, Cursor, etc.)
├── hooks/                     # TanStack Query hooks per resource
├── lib/                        # API client, schemas, utils, GSAP setup
├── store/                     # Zustand auth store
└── types/                     # Shared TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+
- A running instance of the [FixItNow backend](#) (or your own API matching the schema below)

### Installation

```bash
git clone https://github.com/<your-username>/fixitnow-client.git
cd fixitnow-client
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ **CORS note:** the backend only accepts credentialed requests from a whitelisted origin. Make sure `http://localhost:3000` (or your deployed frontend URL) is added to the backend's `FRONTEND_URL` environment variable.

---

## 🔑 Test Credentials

> Replace with your own seeded accounts once deployed.

| Role | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `••••••••` |
| Technician | `technician@example.com` | `••••••••` |
| Admin | `admin@example.com` | `••••••••` |

For testing payments, use Stripe's test card:

```
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
```

---

## 🧭 Core Flow

```
Technician creates profile → adds services → publishes availability
            ↓
Customer browses services → picks a slot → creates a booking (PENDING)
            ↓
Technician ACCEPTS or DECLINES
            ↓ (if accepted)
Customer pays via Stripe Checkout → payment COMPLETED
            ↓
Technician marks IN_PROGRESS → COMPLETED
            ↓
Customer leaves a review → technician rating recalculates
```

---

## 🗺️ Roadmap

- [ ] Real-time notifications (WebSocket / SSE) for booking status changes
- [ ] In-app messaging between customer and technician
- [ ] Pagination on list endpoints
- [ ] Technician earnings & payout dashboard

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](#).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Shanto**
Student Developer — Full-Stack (Backend API design · Database modeling · Modern frontend development)

- 📧 [shanto9070.me@gmail.com](mailto:shanto9070.me@gmail.com)

---

<div align="center">

Built with Next.js, TypeScript & a lot of coffee ☕

</div>