<div align="center">

  # 🏨 StayEase

  **The Next-Generation Boutique Hotel Booking Experience.**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Typescript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  [Features](#-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Installation](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

StayEase is a high-performance, aesthetically driven hotel booking platform built to redefine the travel booking experience. By combining a **liquid glassmorphism** design with robust server-side logic, StayEase offers a premium experience for travelers and a comprehensive management suite for hotel partners.

## ✨ Key Features

### 👤 User Experience
- **Liquid Glass Interface**: A premium, modern UI with sophisticated backdrop blurs and smooth transitions.
- **Smart Booking**: Intuitive date selection with real-time availability and dynamic pricing.
- **Secure Payments**: Frictionless checkout powered by Stripe integration.
- **Reviews & Ratings**: Comprehensive guest feedback system with verified stay verification.

### 🏢 Partner & Admin Suite
- **Partner Dashboard**: All-in-one control center for hotel owners to manage rooms, bookings, and analytics.
- **Nested Room Editor**: Advanced management for room types, amenities, and seasonal pricing.
- **Role-Based Access**: Granular control for Customers, Hotel Admins, and Platform Moderators.
- **Automated Sync**: Seamless availability synchronization to prevent overbooking.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Framer Motion, Lucide Icons |
| **Styling** | Tailwind CSS 4, Glassmorphism, Responsive UI |
| **Backend** | Server Actions, Node.js, NextAuth.js (Auth.js v5) |
| **Database** | PostgreSQL, Prisma ORM |
| **Payments** | Stripe API (Webhooks & Checkout) |
| **Communication** | Nodemailer (Transactional Emails) |

## 🚀 Getting Started

### Prerequisites
- Node.js `^18.0.0` or higher
- PostgreSQL instance (Local or Managed)
- Stripe Developer Account
- Google Cloud Console Project (for OAuth)

### 1. Installation
```bash
git clone https://github.com/yourusername/stayease.git
cd stayease
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stayease"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### 3. Database Initialization
```bash
npx prisma generate
npx prisma db push
```

### 4. Launch
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```text
├── src/
│   ├── actions/        # Server-side logic & mutations
│   ├── app/            # Next.js pages, layouts & API routes
│   ├── components/     # Atomic UI components & layout blocks
│   ├── lib/            # Shared utilities & API clients
│   └── types/          # Global TypeScript interfaces
├── prisma/             # Database schema & migration history
├── public/              # Static assets & images
└── tailwind.config.ts  # Design system configuration
```

## �️ Roadmap
- [ ] Multi-currency support
- [ ] Real-time chat between guests and partners
- [ ] Mobile application (React Native)
- [ ] AI-driven hotel recommendations

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with ❤️ by Taher
</div>
