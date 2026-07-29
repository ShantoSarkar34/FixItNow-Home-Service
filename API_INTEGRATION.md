# API Integration Map — FixItNow

This document maps every frontend route/component to the backend endpoint(s) it calls. Base URL is set via `NEXT_PUBLIC_API_URL`.

## Authentication

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `/register` | `/api/auth/register` | POST | Create account (role: CUSTOMER or TECHNICIAN) |
| `/login` | `/api/auth/login` | POST | Log in, sets httpOnly cookies |
| `useSession()` hook (called from Navbar, dashboard layout, `BookServiceButton`) | `/api/auth/me` | GET | Fetch current user, source of truth for auth state |
| `src/lib/api.ts` (automatic, on any 401) | `/api/auth/refresh-token` | POST | Silently refresh access token, retry original request once |
| `UserMenu`, `DashboardSidebar`, `DashboardMobileNav` (Logout) | `/api/auth/logout` | POST | Clear auth cookies |
| `/dashboard/customer/profile` | `/api/auth/me` | PATCH | Update name/phone/address *(assumed — not confirmed present on backend)* |

## Categories

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `useCategories()` hook (service filters, technician filters, service form) | `/api/categories` | GET | List all categories, public |
| `/dashboard/admin/categories` | `/api/admin/categories` | GET | List categories (admin view) |
| `/dashboard/admin/categories` (create form) | `/api/admin/categories` | POST | Create a category |

## Services

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `/services` | `/api/services?categoryId&location&minPrice&maxPrice&search` | GET | Browse/filter services, public |
| `/services/[id]` | `/api/services/:id` | GET | Service detail, public |
| `/dashboard/technician/services` | `/api/technician/services` | GET | Technician's own services |
| `/dashboard/technician/services/new` | `/api/technician/services` | POST | Create a service |
| `/dashboard/technician/services/[id]/edit` | `/api/technician/services/:id` | PUT | Update a service |
| `/dashboard/technician/services` (delete button) | `/api/technician/services/:id` | DELETE | Delete a service (409 if it has bookings) |

## Technicians

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `/technicians` | `/api/technicians?categoryId&location&search` | GET | Browse/filter technicians, public |
| `/technicians/[id]`, `BookingModal` (slot picker) | `/api/technicians/:id` | GET | Technician profile + services + reviews + available slots, public |
| `/dashboard/technician/profile` | `/api/technician/profile` | GET | Technician's own profile |
| `/dashboard/technician/profile` (save) | `/api/technician/profile` | PUT | Create/update profile (upsert) |
| `/dashboard/technician/availability` | `/api/technician/availability` | GET | Technician's own availability slots |
| `/dashboard/technician/availability` (save) | `/api/technician/availability` | PUT | Replace all unbooked slots |

## Bookings

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `BookingModal` (confirm step) | `/api/bookings` | POST | Create a booking |
| `/dashboard/customer/bookings`, `/dashboard/technician/bookings`, `/dashboard/customer` (overview), `/dashboard/technician` (overview) | `/api/bookings?status&date` | GET | List bookings, auto-scoped by role |
| `/dashboard/customer/bookings/[id]`, `/dashboard/technician/bookings/[id]`, payment redirect pages | `/api/bookings/:id` | GET | Booking detail (ownership-checked) |
| `CancelBookingButton`, `/dashboard/customer/bookings` (cancel action) | `/api/bookings/:id/cancel` | PATCH | Cancel a booking (customer, PENDING only) |
| `TechnicianBookingActions` | `/api/technician/bookings/:id` | PATCH | Accept/Decline/Start/Complete a booking |

## Payments

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `PayNowButton` | `/api/payments/create` | POST | Start Stripe Checkout session for an ACCEPTED booking |
| `/dashboard/customer/payments` | `/api/payments?status` | GET | Customer's payment history |
| `/dashboard/admin` (overview, revenue stat) | `/api/payments?status=COMPLETED` | GET | Sum completed payments *(admin-wide scope unconfirmed)* |
| `/booking/[id]/payment-success`, `/booking/[id]/payment-cancel` | `/api/bookings/:id` | GET | Show booking context after Stripe redirect |

## Reviews

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `ReviewForm` (on completed booking detail) | `/api/reviews` | POST | Submit a review (one per booking, COMPLETED only) |
| `/technicians/[id]` | `/api/reviews?technicianId` | GET | List reviews for a technician, public |

## Admin

| Frontend | Backend Endpoint | Method | Purpose |
|---|---|---|---|
| `/dashboard/admin/users` | `/api/admin/users?role&status&search` | GET | List/filter users |
| `/dashboard/admin/users` (ban/unban) | `/api/admin/users/:id` | PATCH | Update user status |
| `/dashboard/admin/bookings` | `/api/admin/bookings?status&date&technicianId&customerId` | GET | Platform-wide bookings, read-only |
| `/dashboard/admin` (overview stats) | `/api/admin/users`, `/api/admin/bookings`, `/api/payments?status=COMPLETED` | GET | Aggregate KPIs and charts (computed client-side from these three) |

---

## Notes on Response Shape

Every endpoint returns:
```json
{ "success": true, "message": "...", "data": { ... }, "meta": { ... } }
```
Errors return:
```json
{ "success": false, "message": "...", "errorSources": [{ "path": "field", "message": "detail" }] }
```
`src/lib/api.ts` unwraps this envelope automatically and throws a typed `ApiError` on `success: false` or non-2xx status.

## Known Gaps (see Known Limitations in README / project summary for full detail)

- `PATCH /api/auth/me` — assumed, not confirmed on backend.
- Admin-wide scope of `GET /api/payments` — unconfirmed.
- No pagination on any list endpoint.
- No backend support for filtering by rating (frontend implements this client-side only).