import { useCallback, useEffect, useState } from "react";

function normalizeBookingsToTickets(bookings: any[] = []) {
  const tickets: Array<any> = [];
  bookings.forEach((b: any) => {
    // Support different backend shapes. Some responses put movie/screening
    // details under `b.movie` and `b.screening`; others include a
    // `screening` object with `movie_title` / `movie_poster` and a `tickets`
    // array containing seat info.
    const screening = b.screening || {};
    const movie = b.movie || (screening.movie ? screening.movie : {}) || {};

    // Prefer `b.tickets` (example payload) falling back to older keys.
    const seats = b.tickets || b.seats || b.seats_booked || b.selected_seats || [];
    const seatArray = Array.isArray(seats) ? seats : Object.values(seats);

    seatArray.forEach((s: any, idx: number) => {
      // Determine movie title/poster from available fields.
      const movieTitle = movie.title || movie.name || screening.movie_title || b.movie_title || "Unknown";
      const posterUrl = movie.poster || movie.poster_url || screening.movie_poster || "";
      const date = screening.date || screening.start_date || b.date || "";
      const time = screening.time || screening.start_time || b.time || "";
      const venue = screening.auditorium || (screening.auditorium && screening.auditorium.name) || b.venue || "";

      tickets.push({
        id: `${b.id || b.booking_id}-${idx}`,
        movieTitle,
        posterUrl,
        row: s.row ?? s.row_label ?? (s.seat && s.seat.row) ?? "",
        seat: s.seat_number ?? s.number ?? s.seat?.number ?? idx + 1,
        date,
        time,
        format: screening.format || b.format || movie.format || "",
        venue,
        barcode: `${b.barcode || b.id || b.booking_id || "bk"}-${idx + 1}`,
        ticketType: s.tickets?.ticket_type ?? s.ticket_type ?? null,
        bookingStatus: b.status ?? null,
      });
    });
  });
  return tickets;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Array<any>>([]);

  const refresh = useCallback(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("epoch_user") : null;
      const storedUser = raw ? JSON.parse(raw) : null;
      const bookings = (storedUser && ((storedUser.data && storedUser.data.bookings) || storedUser.bookings)) || [];
      setTickets(normalizeBookingsToTickets(bookings));
    } catch {
      setTickets([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tickets, refresh } as const;
}

export default useTickets;
