// API Response Types

export interface Movie {
  id: number;
  era_id: number;
  director_id: number;
  title: string;
  description: string;
  vote_avg: number;
  imdb_id: number;
  omdb_category: string;
  age_rating: string;
  release_date: string; // ISO date string (YYYY-MM-DD)
  runtime_min: number;
  is_featured: boolean;
  poster?: {
    text?: string;
    url?: string;
  } | null;
  slug: string;
  trailer_link: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Era {
  id: number;
  name: string;
  image: string;
}

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  category?: string;
  excerp?: string; // backend uses this field name in example
  read_time_min?: number;
  external_link?: string | null;
  [key: string]: any;
}

export interface SeatApi {
  row: string;
  number: number;
  status: "available" | "unavailable" | "selected";
}

// Auth Payloads

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Booking & Seat Types

export interface CreateBookingBody {
  screening_id: number;
  ticket_type_id: number;
  seat_ids: number[];
  customer: {
    mode: "user" | "guest";
    email?: string;
  };
}

export interface LockBookingScreening {
  movie_title: string;
  movie_poster: string;
  date: string;
  time: string;
  auditorium: string;
  screeningType: string;
}

export interface LockBookingTicket {
  ticket_type: string;
  price: number;
  row: string;
  seat_number: number;
}

export interface LockBookingBooking {
  id: number;
  barcode: string;
  status: string;
  total: number;
  created_at: string;
  screening: LockBookingScreening;
  tickets: LockBookingTicket[];
}

export interface LockBookingResponse {
  booking: LockBookingBooking;
}

// Comment Types

export interface CommentPayload {
  text: string;
  rating: number;
}
