export type UserRole = 'customer' | 'hotel_admin' | 'platform_admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    is_verified: boolean;
    cancellation_count: number;
    no_show_count: number;
    is_blacklisted: boolean;
    created_at: string;
}

export interface Hotel {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    description: string | null;
    address: string;
    city: string;
    country: string;
    star_rating: number;
    amenities: string[];
    images: string[];
    contact_email: string;
    contact_phone: string | null;
    is_active: boolean;
    is_verified: boolean;
}

export interface RoomType {
    id: string;
    hotel_id: string;
    name: string;
    description: string | null;
    max_guests: number;
    bed_configuration: string | null;
    size_sqm: number | null;
    amenities: string[];
    images: string[];
    base_price: number;
}

export interface Booking {
    id: string;
    booking_reference: string;
    user_id: string;
    hotel_id: string;
    room_id: string;
    check_in_date: string;
    check_out_date: string;
    guests_count: number;
    total_amount: number;
    status: BookingStatus;
    guest_name: string;
    guest_email: string;
}
