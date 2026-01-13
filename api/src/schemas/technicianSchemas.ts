import { z } from "zod";

export const createTechnicianSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  availabilityTimes: z.array(z.string().min(4)).min(1)
});

export const updateTechnicianSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  availabilityTimes: z.array(z.string().min(4)).min(1).optional(),
  isActive: z.boolean().optional()
});
