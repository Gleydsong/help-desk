import { Request, Response } from "express";
import { technicianService } from "../services/technicianService";

export const listActiveTechnicians = async (_req: Request, res: Response) => {
  const technicians = await technicianService.listActive();
  return res.json(technicians);
};
