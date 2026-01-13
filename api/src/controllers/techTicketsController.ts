import { Request, Response } from "express";
import { idParamSchema } from "../schemas/commonSchemas";
import { addTicketServiceSchema, updateTicketStatusSchema } from "../schemas/ticketSchemas";
import { ticketService } from "../services/ticketService";
import { withTicketTotal } from "../utils/ticketTotals";

export const listTechTickets = async (req: Request, res: Response) => {
  const tickets = await ticketService.listByTechnician(req.user!.id);
  return res.json(tickets.map(withTicketTotal));
};

export const updateTicketStatusByTech = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { status } = updateTicketStatusSchema.parse(req.body);
  const ticket = await ticketService.updateStatusByTechnician(
    id,
    req.user!.id,
    status
  );
  return res.json(withTicketTotal(ticket));
};

export const addServiceToTicket = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { serviceId } = addTicketServiceSchema.parse(req.body);
  const ticket = await ticketService.addServiceByTechnician(
    id,
    req.user!.id,
    serviceId
  );
  return res.json(ticket ? withTicketTotal(ticket) : ticket);
};
