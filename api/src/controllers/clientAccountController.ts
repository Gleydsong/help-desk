import { Request, Response } from "express";
import { createClientSchema } from "../schemas/clientSchemas";
import { clientService } from "../services/clientService";

export const registerClient = async (req: Request, res: Response) => {
  const data = createClientSchema.parse(req.body);
  const client = await clientService.register(data);
  return res.status(201).json(client);
};
