import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { technicianRepository } from "../repositories/technicianRepository";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/appError";
import { generateTempPassword } from "../utils/password";
import { toSafeUser } from "../utils/userView";

type CreateTechnicianInput = {
  name: string;
  email: string;
  availabilityTimes: string[];
};

type UpdateTechnicianInput = {
  name?: string;
  email?: string;
  availabilityTimes?: string[];
  isActive?: boolean;
};

export const technicianService = {
  async create(data: CreateTechnicianInput) {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await technicianRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: Role.TECH,
      mustChangePassword: true,
      technicianProfile: {
        create: {
          availabilityTimes: data.availabilityTimes
        }
      }
    });

    return {
      user: toSafeUser(user),
      tempPassword
    };
  },

  async list() {
    const technicians = await technicianRepository.list();
    return technicians.map(toSafeUser);
  },

  async listActive() {
    const technicians = await technicianRepository.listActive();
    return technicians.map(toSafeUser);
  },

  async update(id: string, data: UpdateTechnicianInput) {
    const existing = await technicianRepository.findById(id);

    if (!existing) {
      throw new AppError("Technician not found", 404);
    }

    if (data.email) {
      const emailOwner = await userRepository.findByEmail(data.email);
      if (emailOwner && emailOwner.id !== id) {
        throw new AppError("Email already in use", 409);
      }
    }

    const updateData: Parameters<typeof technicianRepository.update>[1] = {
      name: data.name,
      email: data.email,
      isActive: data.isActive
    };

    if (data.availabilityTimes) {
      updateData.technicianProfile = {
        update: {
          availabilityTimes: data.availabilityTimes
        }
      };
    }

    const user = await technicianRepository.update(id, updateData);
    return toSafeUser(user);
  }
};
