# HubBay - Premium African Fusion Eatery

Premium futuristic African fusion restaurant experience for Lagos, built with Next.js 15.

## Overview
HubBay is a luxury dining platform that turns food ordering into a cinematic, concierge-level experience. The interface is designed to feel premium and composed, with curated imagery, refined typography, and motion-first storytelling. Every screen reflects the brand's Leaf Green and Gold palette, while remaining fast and frictionless for customers.

Behind the visuals, HubBay delivers an end-to-end ordering system: customer sign-up, a data-driven menu, a floating smart cart, wallet-first checkout with Paystack, and real-time order tracking. Admins gain a live dashboard that updates order statuses and instantly reflects those changes to customers.

## Experience Walkthrough

### Customer Journey (Step-by-Step)
1. Visit the homepage and discover the menu narrative and featured dishes.
2. Sign up or sign in using credentials, Google, or email magic link.
3. Browse the full menu, filter categories, and open dish details.
4. Add items to the floating cart, adjust quantities, and add special instructions.
5. Choose pickup or delivery, then confirm address and notes.
6. Use wallet balance first, then Paystack covers the remainder if needed.
7. Receive a live order tracking timeline with status updates.
8. View order history, wallet transactions, and leave reviews after delivery.

### Wallet & Payment Flow
1. The wallet stores balances in kobo for accuracy and consistency.
2. Customers can deposit funds using Paystack.
3. During checkout, wallet balance is applied automatically.
4. Any remaining balance is handled by Paystack checkout.
5. Webhook verification updates wallet and order payment status.

### Order Tracking Flow
1. Order is created with status set to `PENDING`.
2. Admin updates status through `PREPARING`, `READY`, `DELIVERED`.
3. Customers see updates instantly on the order tracker.
4. Orders can be cancelled using the `CANCELLED` status when required.

### Admin Journey (Step-by-Step)
1. Log in at `/auth/admin` with the admin credentials.
2. Visit `/admin` or `/dashboard` to view live orders.
3. Review customer info, items, and totals.
4. Update order status to communicate kitchen progress.
5. Updates are reflected instantly on the customer-facing timeline.

## Feature Set (Comprehensive)
- Cinematic homepage with luxury motion UI and spotlighted dishes
- Sticky navigation, premium footer, and brand storytelling sections
- Full menu with filters, search, tags, and pricing
- Floating smart cart with per-item notes and line totals
- Pickup or delivery checkout with ETA support
- Wallet funding via Paystack and wallet-first checkout logic
- Paystack webhook verification for deposits and order payments
- Real-time order tracking timeline with status history
- Customer dashboard with wallet balance and transaction history
- Reviews and ratings after delivery completion
- Admin order console with live status updates
- Help, FAQ, complaints, and newsletter touchpoints
- Light and dark mode toggle with Leaf Green + Gold accents

## Pages & Routes
- `/` — Cinematic homepage and highlights
- `/menu` — Full menu with filters and search
- `/checkout` — Delivery or pickup checkout
- `/wallet` — Wallet balance and deposits
- `/orders` — Order history and tracking access
- `/orders/[orderId]` — Detailed order timeline and review form
- `/dashboard` — Admin order dashboard
- `/admin` — Admin console (same data as dashboard)
- `/auth/signup` — Customer registration
- `/auth/signin` — Customer login
- `/auth/admin` — Admin login
- `/about`, `/faq`, `/contact`, `/terms`, `/privacy-policy` — Informational pages

## API Endpoints
- `/api/auth/[...nextauth]` — NextAuth handlers
- `/api/auth/signup` — Customer sign-up
- `/api/menu` — Menu data (DB or fallback)
- `/api/orders` — Create and list orders
- `/api/orders/[orderId]` — Order updates and status changes
- `/api/orders/verify` — Verify payment outcomes
- `/api/reviews` — Create reviews and ratings
- `/api/wallet` — Wallet balance and transactions
- `/api/wallet/initialize` — Start Paystack wallet deposit
- `/api/wallet/verify` — Verify wallet deposit
- `/api/paystack/webhook` — Paystack webhook listener
- `/api/admin/orders` — Admin order list
- `/api/newsletter` — Newsletter subscription
- `/api/complaints` — Customer complaints/support

## Data Model (Prisma)
- `User` — Customer or admin identity with role and auth metadata.
- `Wallet` — One-to-one wallet with balance in kobo.
- `WalletTransaction` — All wallet debits/credits with Paystack references.
- `Dish` — Menu catalog with categories, pricing, tags, and prep times.
- `Order` — Main order record with delivery details, totals, and statuses.
- `OrderItem` — Individual items inside an order with notes and quantities.
- `OrderTimeline` — Status timeline updates for tracking.
- `Review` — Rating and comments per completed order.
- `Complaint` — Customer issues and support tickets.

Order status lifecycle: `PENDING` → `PREPARING` → `READY` → `DELIVERED` (or `CANCELLED`).

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- MongoDB (Atlas) + Prisma ORM
- NextAuth.js (Credentials, Google, Email)
- Paystack (wallet deposits + checkout)
- Zustand (cart + wallet state)
- Roboto font (headings and body)
- Leaf Green & White theme with dark mode toggle

## Design System

### Typography
Roboto powers both headings and body text for a premium, balanced, and readable tone.

### Color Palette
| Token | Light Mode | Dark Mode | Usage |
| --- | --- | --- | --- |
| Leaf Green (Primary) | `#1F7A4F` | `#006D4F` | Primary actions, highlights |
| Gold (Accent) | `#D4AF37` | `#D4AF37` | Accents, luxury emphasis |
| White / Background | `#FFFFFF` | `#0A0F0C` | Page background |
| Surface | `#F8FAF7` | `#121A17` | Cards, panels |
| Text | `#1F2A25` | `#F5EDE1` | Primary text |
| Secondary | `#4A5C52` | `#A8B5A2` | Subtext and hints |
| Divider | `#DBE4DE` | `#3E4A42` | Borders and separators |

### Motion & UI
Framer Motion drives hero transitions, menu card reveals, and subtle UI micro-interactions.

## State Management
Zustand manages cart and wallet state to keep the checkout flow fast and predictable.

## Authentication & Authorization
NextAuth provides credentials login for customers, a separate admin credentials provider, and optional Google or email sign-in. Admin access is restricted by role and the configured `ADMIN_EMAIL`, with a default admin account auto-created on first login.

## Demo Mode & Fallbacks
If `DATABASE_URL` is not configured, the app loads fallback menu data and admin pages display demo-mode messaging. Payments can be mocked in local development with `HUBBAY_ALLOW_MOCK_PAYMENTS=true`.

## Environment Variables
| Key | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `NEXTAUTH_URL` | Yes | Base URL for NextAuth (use `http://localhost:3001` locally) |
| `NEXTAUTH_SECRET` | Yes | Auth secret for NextAuth |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `EMAIL_SERVER` | Optional | SMTP server for email sign-in |
| `EMAIL_FROM` | Optional | Sender email for magic link |
| `PAYSTACK_SECRET_KEY` | Optional | Paystack secret key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Optional | Paystack public key |
| `NEXT_PUBLIC_BASE_URL` | Recommended | Base URL for callbacks and verification |
| `PAYSTACK_WEBHOOK_SECRET` | Optional | Reserved if using a custom webhook secret |
| `ADMIN_EMAIL` | Recommended | Admin email (default `admin@hubbay.com`) |
| `HUBBAY_ALLOW_MOCK_PAYMENTS` | Optional | Allow mock payments in dev |

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template:
```bash
cp .env.example .env.local
```

3. Fill in `.env.local` with your keys and secrets.

4. Generate Prisma client, push schema, and seed data:
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

5. Start the dev server:
```bash
npm run dev
```

The local app runs at `http://localhost:3001`.

## Scripts
- `npm run dev` — Start development server on port 3001
- `npm run dev:clean` — Clear caches and start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Lint the codebase
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:push` — Push Prisma schema to MongoDB
- `npm run prisma:seed` — Seed sample data

## Admin Login Details
- Email: `admin@hubbay.com`
- Password: `AdminHubBay2025!`

Change these for production and set `ADMIN_EMAIL` in your environment.

## Project Structure
- `app/` — App Router pages, layouts, and routes
- `app/api/` — Route handlers for auth, orders, wallet, Paystack, and reviews
- `components/` — UI, cart, menu, admin, and site components
- `lib/` — Auth, Prisma, Paystack, utilities, and configuration helpers
- `store/` — Zustand stores for cart and wallet
- `prisma/` — Prisma schema and seed script
- `public/` — Static assets
- `types/` — TypeScript type augmentations

## Screenshots

### Homepage
Add `screenshots/homepage.png` when available.

### Menu & Dish Details
Add `screenshots/menu.png` when available.

### Cart & Checkout
Add `screenshots/checkout.png` when available.

### Wallet & Orders
Add `screenshots/wallet-orders.png` when available.

### Admin Dashboard
Add `screenshots/admin.png` when available.

## Future Improvements
- Real-time updates via WebSockets instead of polling
- Loyalty tiers, coupons, and gift cards
- Multi-branch support with role-based admin controls
- PWA/offline menu browsing with push notifications
