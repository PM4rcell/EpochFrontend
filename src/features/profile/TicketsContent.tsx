import { TicketCard } from "./TicketCard";
import type { Ticket } from "../../types/api";

interface TicketsContentProps {
  tickets: Ticket[] | null;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function TicketsContent({ tickets, theme = "default" }: TicketsContentProps) {
  return (
    <section className="py-8">
      {(!tickets || tickets.length === 0) ? (
        <div className="py-20 text-center">
          <p className="text-slate-500">You have no tickets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <TicketCard
              key={t.id}
              movieTitle={t.movieTitle}
              posterUrl={t.posterUrl}
              row={t.row}
              seat={t.seat}
              date={t.date}
              time={t.time}
              format={t.format}
              venue={t.venue}
              barcode={t.barcode}
              ticketType={t.ticketType}
              bookingStatus={t.bookingStatus}
              theme={theme}
            />
          ))}
        </div>
      )}
    </section>
  );
}
