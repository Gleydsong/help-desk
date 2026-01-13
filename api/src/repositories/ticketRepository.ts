import { prisma } from "../lib/prisma";
import { TicketStatus } from "@prisma/client";
import { userSelect } from "../utils/userSelect";

export const ticketRepository = {
  create: (data: Parameters<typeof prisma.ticket.create>[0]) =>
    prisma.ticket.create(data),
  findById: (id: string) =>
    prisma.ticket.findUnique({
      where: { id },
      include: {
        services: true,
        client: { select: userSelect },
        technician: { select: userSelect }
      }
    }),
  listAll: () =>
    prisma.ticket.findMany({
      include: {
        services: true,
        client: { select: userSelect },
        technician: { select: userSelect }
      }
    }),
  listByClient: (clientId: string) =>
    prisma.ticket.findMany({
      where: { clientId },
      include: {
        services: true,
        technician: { select: userSelect },
        client: { select: userSelect }
      }
    }),
  listByTechnician: (technicianId: string) =>
    prisma.ticket.findMany({
      where: { technicianId },
      include: {
        services: true,
        client: { select: userSelect },
        technician: { select: userSelect }
      }
    }),
  updateStatus: (id: string, status: TicketStatus) =>
    prisma.ticket.update({
      where: { id },
      data: { status },
      include: {
        services: true,
        client: { select: userSelect },
        technician: { select: userSelect }
      }
    }),
  addService: (data: Parameters<typeof prisma.ticketService.create>[0]) =>
    prisma.ticketService.create(data)
};
