import { Request, Response } from "express";
import { createTechnicianSchema, updateTechnicianSchema } from "../schemas/technicianSchemas";
import { idParamSchema } from "../schemas/commonSchemas";
import { technicianService } from "../services/technicianService";

export const createTechnician = async (req: Request, res: Response) => {
  const data = createTechnicianSchema.parse(req.body);
  const result = await technicianService.create(data);
  return res.status(201).json(result);
};

export const listTechnicians = async (_req: Request, res: Response) => {
  const technicians = await technicianService.list();
  return res.json(technicians);
};

export const updateTechnician = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateTechnicianSchema.parse(req.body);
  const technician = await technicianService.update(id, data);
  return res.json(technician);
};
