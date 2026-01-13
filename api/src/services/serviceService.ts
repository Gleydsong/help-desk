import { serviceRepository } from "../repositories/serviceRepository";
import { AppError } from "../utils/appError";

type CreateServiceInput = {
  name: string;
  description?: string;
  priceCents: number;
};

type UpdateServiceInput = {
  name?: string;
  description?: string | null;
  priceCents?: number;
  isActive?: boolean;
};

export const serviceService = {
  async create(data: CreateServiceInput) {
    return serviceRepository.create({
      name: data.name,
      description: data.description,
      priceCents: data.priceCents
    });
  },

  async list(isActive?: boolean) {
    return serviceRepository.list(isActive);
  },

  async listActive() {
    return serviceRepository.listActive();
  },

  async update(id: string, data: UpdateServiceInput) {
    const existing = await serviceRepository.findById(id);

    if (!existing) {
      throw new AppError("Service not found", 404);
    }

    return serviceRepository.update(id, data);
  },

  async deactivate(id: string) {
    const existing = await serviceRepository.findById(id);

    if (!existing) {
      throw new AppError("Service not found", 404);
    }

    return serviceRepository.update(id, {
      isActive: false,
      deletedAt: new Date()
    });
  }
};
