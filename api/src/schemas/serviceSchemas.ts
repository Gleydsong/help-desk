import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  priceCents: z.number().int().positive()
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().positive().optional(),
  isActive: z.boolean().optional()
});

export const listServicesSchema = z.object({
  isActive: z.enum(["true", "false"]).optional()
});
