import { Request, Response } from "express";
import { idParamSchema } from "../schemas/commonSchemas";
import { updateTicketStatusSchema } from "../schemas/ticketSchemas";
import { ticketService } from "../services/ticketService";
import { withTicketTotal } from "../utils/ticketTotals";

export const listAllTickets = async (_req: Request, res: Response) => {
  const tickets = await ticketService.listAll();
  return res.json(tickets.map(withTicketTotal));
};

export const updateTicketStatusByAdmin = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { status } = updateTicketStatusSchema.parse(req.body);
  const ticket = await ticketService.updateStatusByAdmin(id, status);
  return res.json(withTicketTotal(ticket));
};
