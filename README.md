# DIGI-FARMS

A full-stack precision agriculture SaaS platform built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, NextAuth v5, Prisma ORM, and Neon PostgreSQL.

## Features

- **5 public landing pages** — Home, About, Marketplace, Technology, Contact
- **Role-based dashboards** for Farmers (15 pages), Suppliers (10 pages), Lenders (10 pages), and Admins (13 pages)
- **AI-powered diagnostics** — crop disease detection, yield forecasting, soil analysis, credit scoring
- **Marketplace** — buy/sell agricultural inputs and produce
- **Financing** — loan applications, AI underwriting, insurance claims
- **Authentication** — Google OAuth + credentials, RBAC middleware

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, custom design tokens |
| UI Components | Custom ShadCN-style (Radix UI primitives) |
| Auth | NextAuth v5 beta, PrismaAdapter |
| ORM | Prisma 7 |
| Database | Neon PostgreSQL (serverless) |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Icons | Lucide React |

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd digi-farms
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/digifarms?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set up the database

```bash
npm run db:push      # Push schema to DB (no migration history)
npm run db:migrate   # Or create and apply named migrations
npm run db:seed      # Populate demo data
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000.

## Demo Accounts

After seeding, log in with:

| Role | Email | Password |
|---|---|---|
| Admin | admin@digifarms.co.ke | admin123 |
| Farmer | john@example.com | farmer123 |
| Supplier | wanjiku@agrosupp.co.ke | supplier123 |
| Lender | agri@equitybank.co.ke | lender123 |

## Project Structure

```
app/
  (landing)/          # Public marketing pages
  (auth)/             # Login / Register
  (dashboard)/
    farmer/           # 15 farmer pages
    supplier/         # 10 supplier pages
    lender/           # 10 lender pages
    admin/            # 13 admin pages
  api/                # REST API routes
components/
  ui/                 # Reusable UI primitives (Radix-based)
  layout/             # Header, footer, mobile nav
  dashboard/          # Sidebar, topbar, shell
lib/
  actions/            # Server actions (farm, product, order, loan)
  auth.ts             # NextAuth v5 config
  db.ts               # Prisma client singleton
  utils.ts            # Helper utilities
  validations.ts      # Zod schemas
prisma/
  schema.prisma       # 20+ model database schema
  seed.ts             # Demo data seeder
```

## Deployment

### Neon Database
1. Create a project at https://neon.tech
2. Copy the connection string to `DATABASE_URL`
3. Run `npm run db:push`

### Vercel
1. Push to GitHub
2. Import at https://vercel.com
3. Add environment variables
4. Deploy

### Google OAuth
1. Google Cloud Console → OAuth 2.0 credentials
2. Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to env

## npm Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Sync schema to DB
npm run db:migrate   # Run migrations
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```
