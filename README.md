# HubBay

Premium futuristic African fusion restaurant web app for Lagos, built with Next.js 15.

## Stack

- Next.js 15 + App Router + TypeScript
- Tailwind CSS + shadcn-style UI primitives + Framer Motion
- Prisma + MongoDB
- NextAuth (Google + Email + Credentials)
- Paystack wallet deposit + checkout
- Zustand cart + wallet state

## Core Features

- Cinematic homepage with background video and luxury motion UI
- Sticky navbar + premium footer (newsletter, hours, socials, Lagos address)
- Menu filters/search with animated food cards
- Floating smart cart (quantity + per-item special instructions)
- Pickup or delivery checkout with ETA
- Wallet-first payment logic with Paystack fallback
- Real-time style order tracking (auto-polling timeline)
- Post-delivery ratings/reviews
- User dashboard with wallet transactions and order history
- Admin order management page (status updates)

## Setup

1. Install deps:
```bash
npm install
```

2. Copy env template:
```bash
cp .env.example .env.local
```

3. Configure `.env.local`:
- `DATABASE_URL` -> MongoDB connection string
- `NEXTAUTH_URL` -> `http://localhost:3000`
- `NEXTAUTH_SECRET` -> random long secret
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` -> Google OAuth app
- `EMAIL_SERVER`, `EMAIL_FROM` -> SMTP details for email sign-in
- `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` -> Paystack keys
- `ADMIN_EMAIL` -> admin account email

4. Generate Prisma client + push + seed:
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

5. Run:
```bash
npm run dev
```

## Authentication

- Customer signup/login is available at `/auth/signup` and `/auth/signin`
- Admin login is available at `/auth/admin`
