# 🏗️ StayEase Hotel Booking Platform - Complete Architecture Analysis

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Project Structure](#2-project-structure)
3. [Database Architecture](#3-database-architecture)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Critical User Journeys](#5-critical-user-journeys)
6. [Event Flow Timeline](#6-event-flow-timeline---booking-to-payment)
7. [Payment System](#7-payment-system-pay-later-model)
8. [Room Availability & Locking](#8-room-availability--locking-system)
9. [Authentication & Session Flow](#9-authentication--session-flow)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [RBAC](#11-role-based-access-control-rbac)
12. [Data Flow Diagram](#12-data-flow-diagram)
13. [Transactions](#13-key-transactions--acid-properties)
14. [Future Enhancements](#14-future-enhancements--gaps)
15. [Security](#15-security-considerations)
16. [Testing Scenarios](#16-testing-scenarios)

---

## 1. SYSTEM OVERVIEW

**StayEase** is a Next.js-based SaaS platform that connects travelers (customers), hotels (partners), and administrators. It uses a **pay-later booking system** with Stripe payment authorization and a sophisticated room availability management system.

### Tech Stack:
- **Frontend:** Next.js 15 (React 19), Tailwind CSS, TypeScript
- **Backend:** Next.js Server Actions, API Routes
- **Database:** PostgreSQL (Supabase)
- **Auth:** NextAuth 5.0 (Google OAuth + Credentials)
- **Payments:** Stripe (manual capture for pay-later)
- **Email:** Nodemailer (Gmail SMTP)
- **Real-time Lock System:** PostgreSQL RPC functions

---

## 2. PROJECT STRUCTURE

```
src/
├── app/                          # Next.js App Router (pages & routes)
│   ├── (auth)/                   # Auth routes (login, register)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (hotel-portal)/           # Hotel partner portal
│   │   └── partner/
│   │       ├── page.tsx          # Partner landing
│   │       ├── apply/page.tsx    # Application form
│   │       └── dashboard/
│   │           ├── page.tsx      # Partner management
│   │           ├── bookings/page.tsx
│   │           └── rooms/page.tsx
│   │
│   ├── (admin)/                  # Admin console
│   │   └── admin/dashboard/page.tsx
│   │
│   ├── (legal)/                  # Legal pages
│   │   ├── cancellation-policy/page.tsx
│   │   ├── partner-agreement/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   │
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── availability/check/route.ts
│   │   ├── partner/apply/route.ts
│   │   └── payments/webhooks/route.ts
│   │
│   ├── account/                  # User account pages
│   │   ├── page.tsx
│   │   ├── bookings/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── booking/                  # Booking flow
│   │   ├── [hotelId]/page.tsx
│   │   └── confirmation/page.tsx
│   │
│   ├── hotels/                   # Hotel detail pages
│   │   └── [slug]/page.tsx
│   │
│   ├── search/page.tsx           # Search & filter
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── actions/                      # Server Actions (mutations)
│   ├── auth.ts                   # Auth operations
│   ├── availability.ts           # Room locking
│   ├── bookings.ts               # Create/cancel bookings
│   ├── payments.ts               # Payment intents
│   ├── hotels.ts                 # Hotel queries
│   └── reviews.ts                # Review management
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   │
│   ├── booking/booking-form.tsx
│   ├── hotels/hotel-card.tsx
│   │
│   ├── layout/
│   │   ├── header.tsx
│   │   └── providers.tsx
│   │
│   ├── search/search-filters.tsx
│   └── ui/button.tsx
│
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── stripe.ts                 # Stripe client
│   ├── mail.ts                   # Email service
│   ├── utils.ts                  # Utilities
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server client
│       └── auth-client.ts        # Auth client
│
├── types/
│   ├── database.ts               # TypeScript interfaces
│   └── next-auth.d.ts            # Auth types
│
├── middleware.ts                 # Route protection
└── supabase/
    └── schema.sql                # Database schema
```

---

## 3. DATABASE ARCHITECTURE

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────┐
│                   PROFILES                  │
│  (id, email, full_name, role, is_verified)  │
└────────────────┬────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────────┐    ┌─────────────────┐
│   HOTELS     │    │ HOTEL_APPLICATIONS
│ (owner_id)───┼────│ (applicant_email)
│              │    │ (status: pending)
└──────┬───────┘    └─────────────────┘
       │
       ▼
┌──────────────────┐
│   ROOM_TYPES     │
│ (hotel_id)───────┤
│ (base_price)     │
└──────┬───────────┘
       │
       ▼
┌─────────────────────┐     ┌──────────────────┐
│      ROOMS          │────▶│ ROOM_AVAILABILITY│
│ (room_number)       │     │ (date, price)    │
│                     │     │ (is_available)   │
│                     │     │ (locked_until)   │
└─────────────────────┘     │ (locked_by)      │
       │                    └──────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│             BOOKINGS                         │
│ (booking_reference, user_id, hotel_id, ...)  │
│ (check_in_date, check_out_date)              │
│ (status: pending|confirmed|cancelled|...)    │
└──────────┬───────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────────┐ ┌──────────────────┐
│ PAYMENTS   │ │   CANCELLATIONS  │
│ (stripe_   │ │ (reason, refund)  │
│  payment_  │ │                   │
│  intent_id)│ │                   │
└────────────┘ └──────────────────┘
    │
    ▼
┌──────────────────┐
│    REVIEWS       │
│ (rating 1-5)     │
│ (user_id)        │
│ (hotel_id)       │
└──────────────────┘
```

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **profiles** | User accounts | `id`, `email`, `role`, `is_verified` |
| **hotels** | Hotel properties | `owner_id`, `name`, `slug`, `is_active` |
| **room_types** | Room categories | `hotel_id`, `name`, `base_price` |
| **rooms** | Individual rooms | `room_type_id`, `room_number` |
| **room_availability** | Daily availability | `room_id`, `date`, `is_available`, `locked_until` |
| **bookings** | Guest reservations | `user_id`, `hotel_id`, `check_in_date`, `status` |
| **payments** | Payment records | `booking_id`, `stripe_payment_intent_id`, `status` |
| **cancellations** | Cancellation details | `booking_id`, `reason`, `refund_amount` |
| **reviews** | Guest reviews | `user_id`, `hotel_id`, `rating`, `content` |
| **hotel_applications** | Partner applications | `applicant_email`, `hotel_name`, `status` |

### Key Features:
- ✅ Row-Level Security (RLS) enabled on sensitive tables
- ✅ `acquire_room_lock()` RPC function for atomic room locking
- ✅ `handle_new_user()` trigger for automatic profile creation
- ✅ Timestamps on all critical tables (`created_at`, `updated_at`)

---

## 4. USER ROLES & PERMISSIONS

### Three-Role Model

| Role | Permissions | Access Routes |
|------|-------------|---------------|
| **customer** | Book hotels, view bookings, leave reviews, cancel bookings | `/search`, `/hotels/[slug]`, `/booking`, `/account` |
| **hotel_admin** | Manage hotel properties, rooms, pricing, bookings | `/partner/dashboard`, `/partner/dashboard/rooms` |
| **platform_admin** | Approve partner applications, manage all hotels, platform analytics | `/admin/dashboard` |

### Authentication Flow

```
1. User registers via email/password or Google OAuth
   └─ Supabase creates auth.users record

2. Trigger: handle_new_user()
   └─ Creates profiles record with default role: 'customer'

3. NextAuth creates session
   └─ Session includes user ID, email, name

4. Middleware checks session for protected routes
   └─ If no session → redirect to /login with callbackUrl

5. Server Actions use await auth() to get current session
   └─ All mutations verify session.user.id before executing
```

---

## 5. CRITICAL USER JOURNEYS

### A. CUSTOMER BOOKING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                   CUSTOMER BOOKING JOURNEY                       │
└─────────────────────────────────────────────────────────────────┘

1. SEARCH & FILTER
   ├─ User visits home page → SearchFilters component
   ├─ Enters search term, dates, guest count
   ├─ Server Action: getHotels(searchTerm)
   └─ Results displayed on /search page

2. HOTEL DETAILS & ROOM SELECTION
   ├─ User clicks hotel card → /hotels/[slug]
   ├─ Page fetches: hotel + room_types from Supabase
   ├─ API GET /availability/check
   │  └─ Checks room_availability table for available dates
   ├─ Available rooms displayed with pricing
   └─ User clicks "Select Experience" → /booking/[hotelId]

3. ROOM LOCKING (10-minute hold)
   ├─ User lands on booking page
   ├─ BookingForm useEffect triggers lockRoom() action
   ├─ Action calls PostgreSQL RPC: acquire_room_lock()
   │  ├─ Sets locked_until = NOW() + 10 minutes
   │  ├─ locked_by = session.user.id
   │  └─ Returns true/false for success
   ├─ If lock acquired: "Confirm Reservation" button enabled
   └─ If lock failed: "Room is no longer available" error

4. PAYMENT AUTHORIZATION (NOT charged yet)
   ├─ User enters guest details
   ├─ User clicks "Confirm Reservation"
   ├─ createPaymentIntent() called with room price
   ├─ Stripe creates PaymentIntent with:
   │  └─ capture_method: "manual" (pay-later)
   │  └─ Status: "requires_payment_method"
   ├─ Stripe Elements UI displays
   ├─ User authorizes card (card NOT charged)
   └─ Intent status changes to: "requires_capture"

5. BOOKING CONFIRMATION
   ├─ createBooking() server action executes:
   │  ├─ INSERT into bookings table
   │  ├─ Set booking.status = 'confirmed'
   │  ├─ INSERT payment record (status: 'authorized')
   │  ├─ UPDATE room_availability for all dates:
   │  │  ├─ is_available = false
   │  │  ├─ locked_until = NULL
   │  │  └─ locked_by = NULL
   │  └─ Release room lock
   ├─ Send confirmation email via Nodemailer
   └─ Redirect to /booking/confirmation

6. PAYMENT CAPTURE (Later, at check-in or before)
   ├─ Hotel staff or admin captures payment
   ├─ capturePayment(paymentIntentId) called
   ├─ Stripe captures the authorized amount
   ├─ Payment status updated: 'captured'
   ├─ captured_at timestamp recorded
   └─ User charged on their card
```

### B. CANCELLATION FLOW

```
┌──────────────────────────────────────────────────────────────┐
│         CUSTOMER CANCELLATION JOURNEY                        │
└──────────────────────────────────────────────────────────────┘

1. USER INITIATES CANCELLATION
   ├─ User navigates to /account/bookings
   ├─ Clicks "Cancel Booking"
   └─ Confirmation dialog displayed

2. REFUND CALCULATION (Time-based Policy)
   ├─ cancelBooking() calculates days until check-in
   ├─ Refund percentages:
   │  ├─ > 7 days: 100% refund
   │  ├─ 3-7 days: 75% refund
   │  ├─ 1-3 days: 50% refund
   │  └─ < 1 day: 0% refund (no refund)
   └─ Penalty = totalAmount - refund

3. DATABASE UPDATES (Transactional)
   ├─ UPDATE bookings.status = 'cancelled'
   ├─ INSERT cancellation record with refund details
   ├─ UPDATE room_availability for all dates:
   │  └─ is_available = true (room available again)
   └─ Release room lock if still active

4. PAYMENT REFUND
   ├─ cancelPayment(paymentIntentId) called
   ├─ Stripe cancels payment intent
   ├─ User's authorized amount released
   └─ No charge appears on user's card

5. NOTIFICATION
   ├─ Send cancellation confirmation email
   ├─ Include refund amount and booking reference
   └─ User receives notification
```

### C. PARTNER (HOTEL) ONBOARDING FLOW

```
┌─────────────────────────────────────────────────────────────┐
│      HOTEL PARTNER ONBOARDING JOURNEY                       │
└─────────────────────────────────────────────────────────────┘

1. PARTNER DISCOVERS PLATFORM
   ├─ Visits /partner page
   ├─ Reads benefits & policies
   └─ Clicks "Apply Now" → /partner/apply

2. APPLICATION SUBMISSION
   ├─ Fills application form with:
   │  ├─ Hotel name, address
   │  ├─ Contact person, phone, email
   │  └─ Documents (images/PDFs)
   ├─ POST /api/partner/apply
   ├─ Data saved to hotel_applications table
   ├─ Status set to 'pending'
   └─ Confirmation message displayed

3. ADMIN REVIEW
   ├─ Admin navigates to /admin/dashboard
   ├─ Views pending applications count
   ├─ Clicks "Review Hotel Applications"
   ├─ Admin can:
   │  ├─ Approve: Status = 'approved'
   │  ├─ Reject: Status = 'rejected'
   │  └─ Request info: Add notes
   ├─ reviewed_by & reviewed_at recorded
   └─ Notification email sent to partner

4. PARTNER ONBOARDING (Post-approval)
   ├─ Partner receives approval email
   ├─ Logs in with credentials
   ├─ Navigates to /partner/dashboard
   ├─ Creates room types (names, bed types, amenities, pricing)
   ├─ Creates individual rooms (room numbers, floors)
   └─ Sets pricing & availability calendar

5. HOTEL GOES LIVE
   ├─ Partner publishes hotel (is_active = true)
   ├─ Hotel appears in search results
   ├─ Booking system enabled
   └─ Revenue tracking begins
```

### D. ADMIN APPROVAL FLOW

```
┌────────────────────────────────────────────────────────┐
│    ADMIN APPROVAL & PLATFORM MANAGEMENT               │
└────────────────────────────────────────────────────────┘

1. ADMIN DASHBOARD
   ├─ Displays metrics:
   │  ├─ Total hotels count
   │  ├─ Total users count
   │  └─ Pending applications count
   ├─ Quick actions:
   │  ├─ Review Hotel Applications
   │  ├─ Manage All Hotels
   │  └─ Manage Platform Users
   └─ Platform Insights (future analytics)

2. APPLICATION REVIEW
   ├─ Click "Review Hotel Applications"
   ├─ List all pending applications
   ├─ View application details & documents
   ├─ Make decision: Approve or Reject
   ├─ Add review notes
   └─ Update application status

3. HOTEL MANAGEMENT
   ├─ View all active hotels
   ├─ Edit hotel details if needed
   ├─ Verify hotel before going live
   ├─ Monitor bookings on platform
   └─ Handle disputes/issues
```

---

## 6. EVENT FLOW TIMELINE - BOOKING TO PAYMENT

```
TIME    EVENT                          COMPONENT              DATABASE STATE
────────────────────────────────────────────────────────────────────────────

T=0     User enters booking page       BookingForm (client)   
        
T=0+    lockRoom() called              useEffect hook         room_availability
                                       → availability action  locked_until=T+10m
                                                               locked_by=user.id
                                                               is_available=true

T=0+1   "Confirm Reservation"          BookingForm click      
        clicked

T=0+2   createPaymentIntent()          payments action        (Stripe side)
        called                         → Stripe API           PaymentIntent created
                                                               status: "requires_
                                                               payment_method"

T=0+3   Stripe UI displays,            Stripe Elements        
        user authorizes card                                  PaymentIntent.status:
                                                               "requires_capture"

T=0+4   createBooking() executes       bookings action        bookings INSERT
                                       → Server Action        booking_reference: BK-xxx
                                                               status: 'confirmed'

T=0+5   Payment recorded               payments action        payments INSERT
                                                               stripe_payment_intent_id
                                                               status: 'authorized'

T=0+6   Room marked unavailable        room_availability      room_availability UPDATE
        for all dates                  UPDATE                 is_available=false
                                                               locked_until=NULL
                                                               locked_by=NULL

T=0+7   Confirmation email sent        sendEmail()            (Email service)
                                       via Nodemailer         Email queued

T=0+8   Redirect to confirmation       router.push()          UI state change
        page

T=0+9   ...

T=CheckIn-1    Hotel staff prepares     (Manual process)       
               room

T=CheckIn      Payment captured         capturePayment()       payments UPDATE
               (by hotel/admin)         (manual or auto)       status: 'captured'
                                                               captured_at: now()

T=CheckIn+1    Guest checks in          (Manual)               bookings UPDATE
                                                                status: 'completed'

T=CheckOut     Guest checks out         (Manual)               
               or no-show               Handle separately
```

---

## 7. PAYMENT SYSTEM (Pay-Later Model)

### Authorization vs. Capture

```
TRADITIONAL (Immediate Charge):
┌──────────────────────────────────────────┐
│ User books → Card charged immediately → Money transfers
└──────────────────────────────────────────┘

STAYEASE (Pay-Later):
┌────────────────────────────────────────────────┐
│ 1. Authorization          2. Capture
│    (Booking)             (At check-in)
│    └─ $0 charged         └─ $ charged
│    └─ Card blocked       └─ Money transfers
│       for $X
└────────────────────────────────────────────────┘
```

### Stripe Flow

```
1. createPaymentIntent()
   ├─ Create intent with:
   │  ├─ amount (in cents)
   │  ├─ currency: "usd"
   │  └─ capture_method: "manual"
   ├─ Returns clientSecret
   ├─ User confirms card via Stripe Elements
   └─ Intent status: "requires_capture"

2. capturePayment()
   ├─ Call: stripe.paymentIntents.capture(paymentIntentId)
   ├─ Captures the authorized amount
   ├─ Intent status: "succeeded"
   ├─ Funds transfer to hotel account (minus Stripe fee ~2.9% + $0.30)
   └─ Update DB: payments.status = 'captured'

Webhook Events (Stripe → API):
├─ payment_intent.amount_capturable_updated
│  └─ Payment status updated to 'authorized'
│
└─ payment_intent.succeeded
   ├─ Payment status updated to 'captured'
   └─ captured_at timestamp set
```

### Payment Flow Diagram

```
User Card ────(Authorize)───► Stripe ────(Create Intent)────► StayEase DB
                               │                                  │
                               │ (10 mins later)                  │
                               │                                  │
                               └────(Capture)────► Bank ────► Settle Funds
                                                    │
                                                    └──► Hotel Account
```

---

## 8. ROOM AVAILABILITY & LOCKING SYSTEM

### The Problem: Double-Booking

On high-demand hotels, two users can book the same room on the same dates simultaneously. This needs atomic prevention.

### The Solution: 10-Minute Room Lock with PostgreSQL RPC

```sql
-- Schema: room_availability
┌──────────────────────────────────────────┐
│ ROOM_AVAILABILITY                        │
├────────────────────────────────────────────
│ id (UUID)                                │
│ room_id (FK: rooms)                      │
│ date (DATE) — one row per day per room   │
│ price (DECIMAL)                          │
│ is_available (BOOLEAN)                   │
│ locked_until (TIMESTAMPTZ) — nullable    │
│ locked_by (FK: profiles) — nullable      │
│ UNIQUE(room_id, date)                    │
└────────────────────────────────────────────┘
```

### Lock Lifecycle

```
Available
   ↓ (User starts booking)
Locked (locked_until=T+10m, locked_by=user.id)
   ↓ (User confirms booking)
Booked (is_available=false, locked_until=NULL)
   ↓ (User cancels booking)
Available (is_available=true, locked_until=NULL)
```

### Race Condition Prevention

```
Scenario: Two users try to book same room simultaneously

T1: User A - lockRoom() 
    → RPC executes acquire_room_lock()
    → Returns true (lock acquired)
    └─ room_availability: locked_until=T1+10m, locked_by=A

T2: User B - lockRoom()
    → RPC executes acquire_room_lock()
    → Checks: locked_until > NOW() AND locked_by != B?
    → YES, lock is held by A
    → Returns false
    └─ Error: "Room is no longer available"
    └─ User B can select different room or date

T3: User A pays
    → room_availability: is_available=false, locked_until=NULL
    → Room is now booked by User A
```

### PostgreSQL RPC Function (acquire_room_lock)

```sql
CREATE OR REPLACE FUNCTION public.acquire_room_lock(
    p_room_id UUID,
    p_dates DATE[],
    p_user_id UUID,
    p_expires_at TIMESTAMPTZ
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available BOOLEAN;
BEGIN
    -- Check if room is available for all requested dates
    SELECT NOT EXISTS (
        SELECT 1 
        FROM public.room_availability 
        WHERE room_id = p_room_id 
        AND date = ANY(p_dates)
        AND (
            is_available = FALSE 
            OR (locked_until > NOW() AND locked_by != p_user_id)
        )
    ) INTO v_available;

    -- If available, lock the room
    IF v_available THEN
        UPDATE public.room_availability
        SET locked_until = p_expires_at,
            locked_by = p_user_id
        WHERE room_id = p_room_id
        AND date = ANY(p_dates);
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Stale Lock Cleanup

```
Scenario: User A locks room but never completes booking

T0: User A locks room (locked_until = T0+10m)
T0+5m: User A closes browser without booking
T0+10m: Lock expires
T0+10m+1s: User B tries to lock room
    → Check: locked_until > NOW()? 
    → NO (lock is stale)
    → Lock acquired by User B

Note: No explicit cleanup needed!
      Expiration is checked on each lock attempt
```

---

## 9. AUTHENTICATION & SESSION FLOW

### NextAuth Session Lifecycle

```
1. USER REGISTERS / LOGS IN
   ├─ Option A: Email/Password
   │  └─ supabase.auth.signUp(email, password)
   │  └─ Trigger: Creates profiles record
   │
   └─ Option B: Google OAuth
      └─ Google redirect → NextAuth OAuth provider
      └─ auth.users created
      └─ Profiles created (if new user)

2. NEXAUTH SESSION CREATED
   ├─ NextAuth creates JWT token containing:
   │  ├─ user.id
   │  ├─ email
   │  └─ name
   ├─ Token stored in:
   │  ├─ HttpOnly cookie (secure, cannot access from JS)
   │  └─ Session callback for serialization
   │
   └─ Session callback:
      async session({ session, token }) {
        session.user.id = token.sub  // Add user ID
        return session
      }

3. PROTECTED ROUTES
   ├─ Middleware checks routes:
   │  ├─ /account/* → Requires auth
   │  ├─ /booking/* → Requires auth
   │  └─ /partner/dashboard/* → Requires auth
   │
   └─ If no auth:
      ├─ Redirect to /login
      └─ Include callbackUrl for redirect after login

4. SERVER ACTIONS USE SESSION
   ├─ await auth() retrieves current session
   ├─ session.user.id used for authorization checks
   ├─ Example (cancelBooking):
   │  └─ verify booking.user_id === session.user.id
   │
   └─ If unauthorized: throw error

5. SESSION EXPIRY
   ├─ NextAuth default: 30 days (configurable)
   ├─ User logged out automatically after expiry
   └─ New login required
```

### Auth Callback Flow

```
NextAuth Config (src/lib/auth.ts):
├─ Providers:
│  ├─ Google OAuth
│  └─ Credentials (email/password)
│
├─ Callbacks:
│  └─ session({ session, token })
│     └─ session.user.id = token.sub
│
└─ Pages:
   └─ signIn: "/login"
```

---

## 10. ERROR HANDLING & EDGE CASES

### Double-Booking Prevention

```
Scenario: Two users try to book same room simultaneously

T1: User A - lockRoom() → SUCCESS (acquired lock)
T2: User B - lockRoom() → FAIL (already locked by A)
    → Error: "Room is no longer available"
    → User B prompted to:
       ├─ Select different room
       ├─ Select different dates
       └─ Or check back later

T3: User A payment fails
    → Catch block calls releaseRoomLock()
    → Room becomes available again
    → User B can now book
```

### Stale Lock Cleanup

```
Scenario: User A locks room but never completes booking

T0: User A locks room (locked_until = T0+10m)
T0+5m: User A closes browser without booking
T0+10m: Lock expires
T0+10m+1s: User B tries to lock room
    → Check: locked_until > NOW()? → NO
    → Lock acquired by User B

Note: No explicit cleanup needed; expiration is checked on each attempt
```

### Cancellation Refund Rules

```
Days until check-in    Refund %    Policy
─────────────────────────────────────────
> 7 days               100%        Full refund
3-7 days               75%         Moderate penalty
1-3 days               50%         High penalty
< 1 day                0%          No refund
```

### Payment Failure Scenarios

```
1. User authorizes card but payment fails
   ├─ Payment intent still in "requires_capture"
   ├─ Room lock released
   └─ User prompted to try again

2. Payment captured but booking confirmation email fails
   ├─ Booking record exists
   ├─ Payment captured
   ├─ Email delivery may retry
   └─ Manual notification if needed

3. Booking created but room_availability update fails
   ├─ Database transaction should be atomic
   ├─ Supabase handles rollback
   └─ User notified of failure
```

---

## 11. ROLE-BASED ACCESS CONTROL (RBAC)

```
Profile.role      Can Access                Restricted Pages
─────────────────────────────────────────────────────────────
customer          /search                   /admin/dashboard
                  /hotels/[slug]            /partner/dashboard
                  /booking
                  /account
                  /account/bookings

hotel_admin       /partner/dashboard        /admin/dashboard
                  /partner/dashboard/rooms  (full access)
                  /partner/dashboard/bookings

platform_admin    /admin/dashboard          /partner/dashboard
                  /admin/applications       (view only)
                  /admin/hotels
                  /admin/users
```

### Authorization Checks

**✅ Implemented:**
- Booking ownership verification in cancelBooking()
- Hotel ownership verification (implied for partner actions)
- Session required for all mutations

**⚠️ Needs Implementation:**
- Explicit role checks in middleware
- Admin role verification for /admin/* routes
- Hotel admin role verification for /partner/dashboard/* routes

---

## 12. DATA FLOW DIAGRAM

```
┌──────────────┐
│   Frontend   │
│ (Next.js     │
│  React)      │
└──────┬───────┘
       │ Requests (JSON)
       ▼
┌──────────────────────┐
│  Next.js Server      │
├──────────────────────┤
│ • Server Actions     │ ──────────┐
│ • API Routes         │           │
│ • Middleware         │           │
│ • NextAuth           │           │
└──────┬───────────────┘           │
       │                           │
       ├─────────────────────────────┼──────────────┐
       │                             │              │
       ▼                             ▼              ▼
    ┌────────────────┐     ┌──────────────┐   ┌──────────┐
    │  Supabase DB   │     │    Stripe    │   │ Nodemailer
    │  PostgreSQL    │     │   (Payments) │   │ (Emails)
    │  (RLS enabled) │     │              │   │
    │                │     │ • PaymentIntent
    │ Tables:        │     │ • Webhook    │   │ • SMTP
    │ • profiles     │     │              │   │   Server
    │ • hotels       │     └──────────────┘   └──────────┘
    │ • bookings     │
    │ • room_avail..│
    │ • payments     │
    │ • reviews      │
    └────────────────┘
         │
         └─ RPC: acquire_room_lock()
```

---

## 13. KEY TRANSACTIONS & ACID PROPERTIES

### Booking Creation Transaction

```
BEGIN TRANSACTION

1. INSERT INTO bookings (booking_reference, user_id, hotel_id, ...)
   → Returns booking.id
   
2. INSERT INTO payments (booking_id, stripe_payment_intent_id, ...)
   → Links payment to booking
   
3. UPDATE room_availability SET is_available = false
   WHERE room_id = X AND date IN (check_in...check_out)
   → Marks dates as booked
   
4. UPDATE room_availability SET locked_until = NULL, locked_by = NULL
   WHERE room_id = X AND locked_by = user.id
   → Releases lock
   
IF ANY STEP FAILS:
   ROLLBACK ALL
   → Booking not created
   → Payment not recorded
   → Room remains available
   → User receives error
   
COMMIT
```

### Atomicity Guarantees

```
Scenario: Payment intent succeeds but email fails

1. Booking is COMMITTED to database
2. Payment is COMMITTED to database
3. Email service may retry or fail silently
4. Worst case: User doesn't receive email but booking is confirmed

Solution: Retry email delivery via job queue (future enhancement)
```

---

## 14. FUTURE ENHANCEMENTS & GAPS

### Currently Missing ❌

- [ ] Rate limiting on APIs
- [ ] Input validation on file uploads (partner documents)
- [ ] Admin role enforcement in middleware
- [ ] Email verification before account activation
- [ ] Two-factor authentication
- [ ] Dispute resolution system
- [ ] Commission calculation & payment to hotels
- [ ] Cancellation policy customization per hotel
- [ ] Dynamic pricing (seasonality)
- [ ] Real-time booking notifications (WebSockets)
- [ ] Inventory sync with external PMS
- [ ] Currency support (multi-currency)

### Recommended Additions 🎯

- [ ] Role-based middleware checks
- [ ] Audit logging (who did what, when)
- [ ] Booking history with transaction receipts
- [ ] Admin approval for high-value cancellations
- [ ] Hotel performance metrics (occupancy, rating trends)
- [ ] Customer loyalty program (rewards points)
- [ ] Review moderation (detect spam/abuse)
- [ ] SMS notifications for critical events
- [ ] Booking reminders (1 week before, 1 day before)
- [ ] Upsell opportunities (room upgrades, add-ons)

---

## 15. SECURITY CONSIDERATIONS

### ✅ Implemented

- HTTPS (via Supabase)
- HttpOnly cookies for sessions (cannot access from JS)
- Row-Level Security on sensitive tables
- Password hashing (Supabase handles)
- OAuth2 (Google provider)
- Server-side authorization checks in some actions
- Server Actions (mutations not exposed to client)

### ⚠️ Needs Improvement

- [ ] Rate limiting on API endpoints (/api/*)
- [ ] CSRF protection
- [ ] Input sanitization (prevent HTML injection in reviews)
- [ ] Admin role enforcement (not checked in code)
- [ ] Sensitive data in logs (payment details)
- [ ] API key exposure (Stripe/Supabase keys in .env)
- [ ] SQL injection prevention (Supabase handles, but verify)

### 🔒 Best Practices Applied

- ✅ Server Actions for mutations (not exposed to client)
- ✅ `auth()` check before database operations
- ✅ Booking ownership validation (user_id check)
- ✅ Middleware route protection
- ✅ Zod schema validation for bookings

---

## 16. TESTING SCENARIOS

### Critical Paths to Test

| Scenario | Expected | Critical? | Difficulty |
|----------|----------|-----------|-----------|
| Lock expires after 10m | Room becomes available | YES | Easy |
| Two users book same room | One succeeds, one fails | YES | Medium |
| Cancel booking before check-in | Correct refund % applied | YES | Medium |
| Stripe webhook delayed | Payment still records (idempotent) | YES | Hard |
| Partner applies with duplicate email | Reject or merge application | MEDIUM | Easy |
| Admin approval triggers notification | Email sent to partner | MEDIUM | Medium |
| Payment capture fails | Booking status, room availability inconsistent | YES | Hard |
| User cancels then re-books same room | Both operations succeed | YES | Medium |
| Booking confirmation email fails | Booking still confirmed in DB | MEDIUM | Easy |
| Multiple cancellations in sequence | Refund logic always correct | YES | Hard |

### Test Coverage Recommendations

```
Unit Tests:
├─ Refund calculation logic
├─ Lock expiration logic
├─ Booking status transitions
└─ Payment status transitions

Integration Tests:
├─ End-to-end booking flow
├─ Cancellation with email
├─ Room availability after cancellation
├─ Payment authorization & capture
└─ Partner application approval

E2E Tests (Cypress/Playwright):
├─ User search → booking → confirmation
├─ User cancellation → refund verification
├─ Partner signup → admin approval → hotel creation
└─ Admin dashboard operations
```

---

## SUMMARY

**StayEase** is a well-structured, multi-tenant booking platform with:

### ✅ Strengths

- Role-based access (customer/partner/admin)
- Complex room availability locking with race condition prevention
- Pay-later payment model via Stripe manual capture
- Event-driven confirmations (email notifications)
- Refund policies based on cancellation timing
- PostgreSQL RPC for atomic operations

### 🎯 Core Value Proposition

**Travelers book without paying immediately; hotels get confirmed reservations and payment is captured at check-in.**

### 📊 System Flow at a Glance

```
Customer: Search → Book (lock room) → Authorize payment → Confirmation
                                        ↓
                            (10 mins later, at check-in)
                                        ↓
Hotel: Review booking → Capture payment → Guest checks in

Partner: Apply → Admin approval → Create hotel → Goes live → Revenue

Admin: Review apps → Approve/Reject → Monitor platform → Analytics
```

---

## Quick Reference

| Component | Technology | Purpose |
|-----------|-----------|---------|
| UI Framework | Next.js 15 + React 19 | Server/Client rendering |
| Styling | Tailwind CSS + Custom Glass | Nature-inspired UI |
| Database | PostgreSQL (Supabase) | Data persistence + RLS |
| Authentication | NextAuth 5.0 | Session management |
| Payments | Stripe API | Payment authorization & capture |
| Email | Nodemailer | Confirmation & notification emails |
| Real-time Locking | PostgreSQL RPC | Atomic room locking |
| Middleware | Next.js Middleware | Route protection |
| Type Safety | TypeScript | Compile-time safety |

---

**Last Updated:** January 28, 2026
**Version:** 1.0
**Repository:** hotelsbooking (tahermodel)
**Branch:** main
