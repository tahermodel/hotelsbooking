# Hotels App - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Vercel Postgres recommended)
- Stripe account for payments
- Google OAuth credentials

## Environment Setup

1. Copy `.env.example` to `.env` (if not already done)
2. Fill in all required environment variables:

```env
DATABASE_POSTGRES_PRISMA_URL=your_pooled_connection_url
DATABASE_POSTGRES_URL_NON_POOLING=your_direct_connection_url

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@yourapp.com
```

## Installation

```bash
npm install
```

## Database Setup

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create Database Tables
```bash
npx prisma db push
```

**OR** if you want to create migrations:
```bash
npx prisma migrate dev --name init
```

### 3. (Optional) Seed Database
Create a seed script in `prisma/seed.ts` and run:
```bash
npx prisma db seed
```

## Development

### Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### View Database
```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view/edit database records.

## Production Build

```bash
npm run build
npm start
```

## Common Commands

### Prisma
- `npx prisma generate` - Regenerate Prisma Client after schema changes
- `npx prisma db push` - Push schema changes to database (dev)
- `npx prisma migrate dev` - Create and apply migrations (recommended)
- `npx prisma migrate deploy` - Apply migrations (production)
- `npx prisma studio` - Open database GUI
- `npx prisma validate` - Validate schema file
- `npx prisma format` - Format schema file

### Next.js
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## User Roles

The application supports three user roles:

1. **customer** (default) - Can book hotels, write reviews
2. **hotel_admin** - Can manage their own hotels and rooms
3. **platform_admin** - Full access to all features

## First-Time Setup

1. **Register an Admin User**:
   - Sign up at `/register`
   - Verify email
   - Manually update role in database to `platform_admin`

2. **Create Hotels**:
   - Use admin dashboard or Prisma Studio
   - Add room types to hotels

3. **Test Booking Flow**:
   - Create a customer account
   - Search for hotels
   - Make a test booking

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_POSTGRES_PRISMA_URL` is correct
- Check if database is accessible
- Ensure IP is whitelisted (if using cloud database)

### Prisma Client Not Found
```bash
npx prisma generate
```

### Type Errors
- Some TypeScript errors related to Prisma model names are cosmetic
- The application will run correctly despite these warnings
- Run `npx prisma generate` to refresh types

### Email Not Sending
- Check SMTP credentials
- For Gmail, use App Password (not regular password)
- Verify SMTP port (587 for TLS, 465 for SSL)

### Stripe Webhooks (Local Development)
```bash
stripe listen --forward-to localhost:3000/api/payments/webhooks
```

## Project Structure

```
src/
├── actions/          # Server actions
├── app/              # Next.js app router pages
│   ├── (admin)/      # Admin portal
│   ├── (hotel-portal)/ # Partner portal
│   └── api/          # API routes
├── components/       # React components
├── lib/              # Utilities
│   ├── auth.ts       # NextAuth configuration
│   ├── prisma.ts     # Prisma client
│   └── stripe.ts     # Stripe client
└── types/            # TypeScript types

prisma/
└── schema.prisma     # Database schema
```

## Support

For issues or questions:
1. Check `MIGRATION_SUMMARY.md` for migration details
2. Review Prisma documentation: https://www.prisma.io/docs
3. Check NextAuth.js docs: https://next-auth.js.org
