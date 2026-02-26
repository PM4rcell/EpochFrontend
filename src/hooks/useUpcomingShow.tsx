import { useMemo } from "react";
import type { LockBookingBooking } from "../types/index";

interface UpcomingShow {
	title: string;
	poster: string;
	date: string;
	time: string;
	theater: string;
	seats: string;
	format: string;
}

type StoredScreening = LockBookingBooking["screening"] & {
	start_time?: string;
	start_date?: string;
};

type StoredBooking = LockBookingBooking & {
	screening: StoredScreening;
};

const FALLBACK_SHOW: UpcomingShow = {
	title: "The Eternal Voyage",
	poster:
		"https://images.unsplash.com/photo-1574923930958-9b653a0e5148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	date: "Friday, Nov 8",
	time: "7:30 PM",
	theater: "Cinema 1",
	seats: "E7, E8",
	format: "IMAX",
};

function getStoredBookings(): StoredBooking[] {
	try {
		const raw = typeof window !== "undefined" ? localStorage.getItem("epoch_user") : null;
		if (!raw) return [];
		const parsed = JSON.parse(raw) as {
			data?: { bookings?: StoredBooking[] };
			bookings?: StoredBooking[];
		};
		const bookings = parsed?.data?.bookings ?? parsed?.bookings ?? [];
		return Array.isArray(bookings) ? bookings : [];
	} catch {
		return [];
	}
}

function getStartTimeMs(booking: StoredBooking): number {
	const startTime = booking?.screening?.start_time;
	if (!startTime) return Number.POSITIVE_INFINITY;
	const ms = new Date(startTime).getTime();
	return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
}

function mapToUpcomingShow(booking: StoredBooking): UpcomingShow {
	const seats = (booking?.tickets ?? [])
		.map((ticket) => `${ticket.row}${ticket.seat_number}`)
		.join(", ");

	return {
		title: booking?.screening?.movie_title ?? FALLBACK_SHOW.title,
		poster: booking?.screening?.movie?.poster?.url ?? FALLBACK_SHOW.poster,
		date: booking?.screening?.start_date ?? booking?.screening?.date ?? FALLBACK_SHOW.date,
		time: booking?.screening?.time ?? FALLBACK_SHOW.time,
		theater: booking?.screening?.auditorium ?? FALLBACK_SHOW.theater,
		seats: seats || "—",
		format: booking?.screening?.screeningType ?? FALLBACK_SHOW.format,
	};
}

export default function useUpcomingShow() {
	const storedBookings = useMemo(() => getStoredBookings(), []);

	const nextShow = useMemo<UpcomingShow>(() => {
		if (storedBookings.length === 0) return FALLBACK_SHOW;

		const now = Date.now();
		const selected = storedBookings
			.map((booking) => ({ booking, ms: getStartTimeMs(booking) }))
			.reduce((closest, current) => {
				const closestDiff = Math.abs(closest.ms - now);
				const currentDiff = Math.abs(current.ms - now);
				return currentDiff < closestDiff ? current : closest;
			});

		if (!selected?.booking) return FALLBACK_SHOW;
		return mapToUpcomingShow(selected.booking);
	}, [storedBookings]);

	return { nextShow, hasUpcomingBooking: storedBookings.length > 0 } as const;
}
