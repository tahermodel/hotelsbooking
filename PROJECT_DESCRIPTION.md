# 🏨 StayEase - Hotel Booking Platform

## Project Overview

**StayEase** is a premium, full-stack hotel booking platform built with modern web technologies. It combines a luxury liquid glassmorphism design with a robust backend to deliver an exceptional experience for both travelers and hotel partners. The platform is designed to handle complex booking workflows, payment processing, and comprehensive hotel management.

---

## 🎯 Core Features

### **1. Guest Features**
- **Intuitive Booking Experience**: Easy-to-use hotel search and room selection with real-time availability checking
- **Smart Date Selection**: Interactive calendar with instant availability updates and dynamic pricing
- **Secure Payment Processing**: Frictionless Stripe-powered checkout with webhook verification
- **Guest Reviews & Ratings**: Verified stay reviews with comprehensive feedback system
- **Booking Management**: View, modify, and cancel bookings from the account dashboard
- **Favorites System**: Save preferred hotels for quick access
- **Email Verification**: Secure registration with email verification tokens

### **2. Hotel Partner Features**
- **Partner Dashboard**: Comprehensive management center for hotel owners
- **Room Management**: Advanced editor for room types, amenities, pricing, and images
- **Availability Control**: Real-time room availability management with date-based locking
- **Booking Overview**: Track all bookings with status management (confirmed, cancelled, completed, no-show)
- **Partner Application System**: Streamlined onboarding process for new hotel partners
- **Dynamic Pricing**: Support for seasonal and base pricing strategies
- **Analytics Access**: View booking metrics and performance data

### **3. Admin Features**
- **Platform Administration**: Full-stack management dashboard for platform moderators
- **Hotel Application Review**: Approve or reject new hotel partner applications
- **User Management**: Monitor user roles, verify accounts, and manage access

### **4. Business Logic**
- **Booking Status Management**: Comprehensive tracking from pending → confirmed → completed/cancelled/no-show
- **Guest Tracking**: Blacklisting system with cancellation and no-show counters
- **Availability Synchronization**: Prevention of overbooking with atomic availability updates
- **Payment Security**: PCI-compliant Stripe integration with webhook verification
- **Email Notifications**: Transactional emails for confirmations, cancellations, and updates

---

## 🛠️ Technical Architecture

### **Frontend Stack**
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS 4 with custom Glassmorphism components
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: Zod for schema validation and type safety
- **UI Components**: Custom Radix UI-based components (button, input, calendar, popover, badge, card)

### **Backend Stack**
- **Runtime**: Node.js with Next.js Server Actions
- **Authentication**: Auth.js v5 (NextAuth) with Google OAuth provider
- **API Routes**: RESTful endpoints for payments, availability, bookings, and partner operations
- **Server Actions**: Secure server-side mutations for bookings, reviews, and user actions
- **Database ORM**: Prisma with PostgreSQL

### **Database**
- **Provider**: PostgreSQL with connection pooling (Prisma Accelerate)
- **Models**:
  - User/Profile (with roles and verification status)
  - Hotel (with owner relationships and verification)
  - RoomType (with availability tracking)
  - Booking (with payment and review relationships)
  - Payment (Stripe payment intent mapping)
  - Review (verified stay reviews)
  - RoomAvailability (date-based availability with locking)
  - Cancellation (refund tracking)
  - Favorite (wish list system)
  - HotelApplication (partner onboarding)
  - Account/Session/VerificationToken (Auth.js integration)

### **Payment Processing**
- **Gateway**: Stripe with webhook integration
- **Flow**: Create Payment Intent → Capture on Booking Confirmation → Handle Refunds
- **Security**: Secure webhook validation with signature verification

### **Email Communication**
- **Service**: Nodemailer with SMTP configuration
- **Templates**: Transactional email templates for confirmations, cancellations, and notifications
- **Use Cases**: Email verification, booking confirmations, cancellation notices

---

## 🏗️ Project Structure

The project is organized into several key directories:

**src/actions/**: Server-side mutations including authentication, availability management, bookings, payments, reviews, and user operations.

**src/app/**: Next.js App Router with organized route groups:
- **(auth)**: Login and registration pages
- **(hotel-portal)**: Partner-only routes including application and dashboard
- **(admin)**: Platform admin routes for managing applications and system dashboard
- **(legal)**: Privacy policy, terms of service, cancellation policy, and partner agreement
- **account**: User dashboard with bookings, favorites, and reviews
- **api**: RESTful endpoints for authentication, availability, payments, partner operations, and cron tasks
- **booking**: Hotel booking flow with confirmation pages
- **hotels**: Hotel listing and detail pages
- **rooms**: Individual room detail pages

**src/components/**: Reusable React components organized by feature (account, admin, auth, booking, forms, hotels, layout, search, ui).

**src/lib/**: Utility functions and configurations for authentication, database, email, payments, and general helpers.

**src/types/**: TypeScript definitions for database models and Auth.js type extensions.

**src/middleware.ts**: Next.js middleware for enforcing authentication checks.

**prisma/**: Database schema definition and migration history.

---

## 🔐 Three-Role Access Control System

StayEase implements a comprehensive role-based access control (RBAC) system with three distinct user roles, each with specific permissions and capabilities:

### **Role 1: Customer (Guest)**
**Purpose**: Regular users booking hotels and staying at properties

**Permissions & Access**:
- Browse and search available hotels
- View hotel details, room options, and pricing
- Access the booking flow for selected hotels
- Create and manage bookings
- View booking history and status
- Manage favorites (wish list)
- Leave reviews for completed stays
- Access personal account dashboard at `/account`
- Manage booking confirmations and cancellations
- View booking details and payment receipts

**Database Attributes**: `role = "customer"` (default)

### **Role 2: Hotel Admin (Hotel Partner)**
**Purpose**: Hotel owners and managers who operate properties on the platform

**Permissions & Access**:
- Submit partner application to become a hotel owner
- Access exclusive partner dashboard at `/partner/dashboard`
- Create and manage multiple hotels
- Add, edit, and remove room types
- Manage room amenities and pricing strategies
- Control room availability on a date-by-date basis
- View all incoming bookings for their hotels
- Track payment and refund information
- Monitor and respond to guest reviews
- Update hotel information and photos
- Access analytics about their bookings

**Database Attributes**: `role = "hotel_admin"`

**Access Path**: Protected route `/partner/dashboard` - Only accessible after admin approval

### **Role 3: Platform Admin (System Administrator)**
**Purpose**: System moderators who oversee the entire platform

**Permissions & Access**:
- Access comprehensive admin dashboard at `/admin`
- Review and approve/reject hotel partner applications
- Manage all user accounts and roles
- Monitor platform activity and metrics
- Verify hotel profiles and legitimacy
- Handle user disputes and complaints
- Manage platform-wide settings
- Access all platform data and reports
- Assign or modify user roles
- Moderate hotel reviews if needed

**Database Attributes**: `role = "platform_admin"`

**Access Path**: Protected route `/admin` - Only accessible to platform administrators

### **Authentication & Security Implementation**

- **Provider**: Google OAuth via Auth.js v5 for primary authentication
- **Session Management**: Server-side sessions with JWT tokens ensuring secure session handling
- **Role Enforcement**: Next.js middleware (`middleware.ts`) validates user roles on every request
  - Customers are restricted to customer-facing pages
  - Hotel Admins can only access partner-related functionality
  - Platform Admins have unrestricted access to admin panels
- **JWT Token Enhancement**: User roles are embedded in JWT tokens for quick permission checks
- **Password Hashing**: bcryptjs provides secure password storage for password-based authentication
- **Email Verification**: Token-based email verification with expiration ensures valid email addresses
- **Session Callbacks**: Auth.js callbacks (`jwt` and `session` callbacks) inject role information into user sessions

### **Role Upgrade Process**

1. **Customer → Hotel Admin**: User submits a partner application in the partner portal
2. **Application Review**: Platform Admin reviews the application in the admin dashboard
3. **Approval**: Once approved, the user's role is upgraded to `hotel_admin` in the database
4. **Access Grant**: User can now access the `/partner/dashboard` and manage hotels
5. **Verification**: Platform Admin can verify the hotel profile for credibility

---

## 💳 Payment Flow

1. **Booking Initiation**: User selects dates and rooms
2. **Payment Intent Creation**: Stripe creates a PaymentIntent on checkout
3. **Client-Side Confirmation**: Stripe.js handles card tokenization
4. **Server Confirmation**: Backend captures payment on booking confirmation
5. **Webhook Verification**: Stripe webhooks confirm payment status
6. **Refund Handling**: Cancellations trigger refund processing

---

## 📊 Database Schema Highlights

### **User Model (Profiles Table)**
The User model is central to the 3-role system and stores comprehensive information for all user types:

- **Role Field**: Enum supporting three values (customer, hotel_admin, platform_admin) - determines all access permissions
- **Authentication**: Email, password (hashed), and optional OAuth accounts
- **Verification**: emailVerified timestamp and is_verified boolean for account verification status
- **Guest Behavior Tracking**: cancellation_count, no_show_count, and is_blacklisted flag for managing problematic guests
- **Relationships**:
  - Multiple bookings (as a guest customer)
  - Hotels owned (as a hotel_admin)
  - Reviews written (for completed bookings)
  - Favorite hotels saved
  - Hotel applications submitted
  - Cancellations made
- **Timestamps**: created_at and updated_at for audit logging

### **Booking Model**
- Reference number generation for tracking
- Status management (pending, confirmed, cancelled, completed, no_show)
- Guest information tracking
- Payment and review relationships
- Timestamps for audit logging

### **RoomAvailability Model**
- Date-based availability tracking
- Locking mechanism to prevent race conditions
- Atomic updates to ensure data consistency

---

## 🚀 Deployment Ready

- **Database**: PostgreSQL with Prisma (Accelerate ready for edge computing)
- **Authentication**: Auth.js v5 compatible with serverless deployments
- **Payments**: Webhook-based Stripe integration for production
- **Email**: SMTP configuration for transactional emails
- **Build**: TypeScript compilation with Next.js 15 optimizations

---

## 📦 Key Dependencies

Next.js 15.1.9 serves as the primary framework, React 19.2.3 provides the UI library, and TypeScript 5.7.2 ensures type safety throughout the application.

Data management is handled by Prisma 5.22.0 as the ORM with PostgreSQL as the database provider. Authentication is powered by Auth.js 5.0.0-beta.25 with Google OAuth integration.

Payment processing uses Stripe 17.4.0 with webhook support. Frontend styling combines Tailwind CSS 4.0.0 for responsive design and Framer Motion 12.29.2 for smooth animations.

Form validation is managed by Zod 3.24.1, and email services are provided by Nodemailer 6.9.16 for transactional emails. UI components leverage Radix UI primitives through react-popover and react-slot.

---

## 🎨 Design Highlights

- **Liquid Glassmorphism**: Premium backdrop blur effects with smooth gradients
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Accessible Components**: ARIA-compliant UI with Radix UI primitives
- **Smooth Animations**: Framer Motion for transition effects
- **Dark Mode Ready**: Tailwind dark mode support throughout

---

## 📝 Development Standards

- **Language**: TypeScript for type safety
- **Validation**: Zod schemas for runtime type checking
- **Code Organization**: Feature-based folder structure
- **Database Migrations**: Prisma migrations for version control
- **Environment Management**: .env file for configuration
- **Linting**: ESLint integration for code quality

---

## 🔄 Workflow Summary

### Guest Booking Flow
1. Search hotels by location and dates
2. View available rooms and pricing
3. Add room to cart
4. Proceed to checkout (requires login)
5. Enter guest details and card information
6. Confirm booking (payment captured)
7. Receive confirmation email
8. View booking in account dashboard
9. Leave review after stay completion

### Hotel Partner Workflow
1. Submit partner application
2. Await admin approval
3. Create hotel profile with details and images
4. Add room types with amenities and pricing
5. Manage room availability calendar
6. View incoming bookings
7. Track payment and refunds
8. Monitor guest reviews

---

## 🎓 Architecture Philosophy

**StayEase** follows modern full-stack development practices:
- **Server-First**: Server Actions for mutations, API routes for webhooks
- **Type Safety**: End-to-end TypeScript for compile-time safety
- **Performance**: Next.js 15 with App Router for optimal routing
- **Security**: NextAuth for authentication, webhook verification for payments
- **Scalability**: Prisma ORM for database abstraction and optimization
- **User Experience**: Premium UI with real-time feedback and smooth animations

---

**Created**: 2025-2026  
**License**: MIT  
**Repository**: github.com/tahermodel/hotelsbooking
