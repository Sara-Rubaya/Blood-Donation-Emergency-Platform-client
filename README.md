# LifeDrop — Blood Donation & Emergency Platform (Frontend)

Next.js 16 (App Router) + TypeScript frontend for the Blood Donation &
Emergency Platform, built against the MERN backend (`/api`).

## Stack
- Next.js 16, App Router, TypeScript
- Tailwind CSS v4 (CSS-first theme, dark/red palette)
- TanStack Query — server state, caching, mutations
- Zustand (`persist`) — auth state, mirrored into cookies for the proxy/middleware
- React Hook Form + Zod — every form, with real-time validation
- Recharts — admin & donor charts
- Sonner — toast notifications
- Hand-rolled shadcn-style primitives (Button, Input, Select, Card, Badge, Skeleton...)

## Setup
```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Run the backend first (see its own README), then apply the 3 small
additions in the separate `backend-updates` bundle (demo accounts +
`/payments/mine` + `/donations/mine`) so every page here has real data
to call.

## Roles & routes
| Role | Home | Protected prefix |
|------|------|-------------------|
| Admin | `/admin` | `/admin/*` |
| Donor | `/provider` | `/provider/*` |
| Requester | `/dashboard` | `/dashboard/*` |

`proxy.ts` (Next 16's middleware convention) reads `bd_token` / `bd_role`
cookies — set by the Zustand auth store on login — and redirects
unauthenticated or wrong-role visitors away from protected routes.

## One-click demo login
`/login` has Quick Demo Login buttons for all 3 roles. They log in with:
- `admin@blooddonation.com` / `Admin@123`
- `donor@blooddonation.com` / `Donor@123`
- `requester@blooddonation.com` / `Requester@123`

These only work once you've run the backend's seed script (see
`backend-updates/README.md`).

## Pages (20 total)
**Public (6):** Home, About, Services, FAQ, Contact, 404
**Auth (2):** Login (with demo logins), Register
**Admin (3):** Overview (charts), Manage Users (search/filter/paginate, all URL-synced), Reports (status override)
**Requester (4):** My Requests, New Request (3-step wizard), Payments, Profile
**Donor (3):** Available Requests (browse & match), My Impact (donation history + chart), Profile & Availability
**Payment (2):** Success, Cancel

Every data-fetching route has a matching `loading.tsx` skeleton. A global
`error.tsx` catches render errors; API failures surface as toast
notifications instead.

## Payments (SSLCommerz, test mode)
Requesters can pay an optional ৳150 "priority processing" fee on a
pending request (`/dashboard/payments`). This calls the backend's
`/payments/initiate`, then confirms via `/payments/success` on redirect.
The backend's SSLCommerz calls are stubbed (see its `payment.service.ts`
`TODO`s) — plug in real store credentials there to go live; the frontend
flow (initiate → success/cancel redirect) is already wired for it.

## Folder structure
```
app/
  (marketing)/        # Home, About, Services, FAQ, Contact — shared Navbar+Footer layout
  login/ register/    # standalone auth pages
  admin/               # ADMIN dashboard (layout + 3 pages + loading states)
  dashboard/           # REQUESTER dashboard (layout + 4 pages + loading states)
  provider/            # DONOR dashboard (layout + 3 pages + loading states)
  payment/success|cancel/
  not-found.tsx error.tsx layout.tsx globals.css
components/
  ui/        # Button, Input, Label, Select, Textarea, Card, Badge, Skeleton
  shared/    # DataTable, Pagination, SearchInput, StatCard, StatusBadge, EmptyState
  layout/    # Navbar, Footer, DashboardShell
  providers/ # QueryProvider
lib/
  api.ts  auth-store.ts  types.ts  utils.ts
  hooks/  # one file per resource (auth, users, blood-requests, payments, donations)
          # + useDebounce, usePagination, useUrlState
proxy.ts   # route guarding (Next 16's middleware convention)
```
