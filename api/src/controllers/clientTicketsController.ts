import { Request, Response } from "express";
import { createTicketSchema } from "../schemas/ticketSchemas";
import { ticketService } from "../services/ticketService";
import { withTicketTotal } from "../utils/ticketTotals";

export const createTicket = async (req: Request, res: Response) => {
  const data = createTicketSchema.parse(req.body);
  const ticket = await ticketService.createByClient(req.user!.id, data);
  return res.status(201).json(withTicketTotal(ticket));
};

export const listClientTickets = async (req: Request, res: Response) => {
  const tickets = await ticketService.listByClient(req.user!.id);
  return res.json(tickets.map(withTicketTotal));
};
