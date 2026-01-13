import { z } from "zod";
import { TicketStatus } from "@prisma/client";

export const createTicketSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  technicianId: z.string().uuid(),
  serviceIds: z.array(z.string().uuid()).min(1)
});

export const addTicketServiceSchema = z.object({
  serviceId: z.string().uuid()
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus)
});
