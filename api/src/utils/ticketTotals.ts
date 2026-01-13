import { Ticket, TicketService } from "@prisma/client";

type TicketWithServices = Ticket & { services: TicketService[] };

export const withTicketTotal = (ticket: TicketWithServices) => {
  const totalPriceCents = ticket.services.reduce(
    (sum, item) => sum + item.priceCentsSnapshot,
    0
  );

  return {
    ...ticket,
    totalPriceCents
  };
};
