import { Request, Response } from "express";
import { idParamSchema } from "../schemas/commonSchemas";
import { updateProfileSchema } from "../schemas/profileSchemas";
import { clientService } from "../services/clientService";

export const listClients = async (_req: Request, res: Response) => {
  const clients = await clientService.list();
  return res.json(clients);
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateProfileSchema.parse(req.body);
  const client = await clientService.update(id, data);
  return res.json(client);
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  await clientService.remove(id);
  return res.status(204).send();
};
