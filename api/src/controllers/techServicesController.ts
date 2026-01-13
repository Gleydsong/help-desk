import { Request, Response } from "express";
import { serviceService } from "../services/serviceService";

export const listTechServices = async (_req: Request, res: Response) => {
  const services = await serviceService.listActive();
  return res.json(services);
};
