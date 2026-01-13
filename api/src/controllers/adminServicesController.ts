import { Request, Response } from "express";
import { createServiceSchema, listServicesSchema, updateServiceSchema } from "../schemas/serviceSchemas";
import { idParamSchema } from "../schemas/commonSchemas";
import { serviceService } from "../services/serviceService";

export const createService = async (req: Request, res: Response) => {
  const data = createServiceSchema.parse(req.body);
  const service = await serviceService.create(data);
  return res.status(201).json(service);
};

export const listServices = async (req: Request, res: Response) => {
  const { isActive } = listServicesSchema.parse(req.query);
  const parsedActive = typeof isActive === "string" ? isActive === "true" : undefined;
  const services = await serviceService.list(parsedActive);
  return res.json(services);
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateServiceSchema.parse(req.body);
  const service = await serviceService.update(id, data);
  return res.json(service);
};

export const deactivateService = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const service = await serviceService.deactivate(id);
  return res.json(service);
};
