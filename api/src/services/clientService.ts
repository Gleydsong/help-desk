import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/appError";
import { toSafeUser } from "../utils/userView";

type UpdateClientInput = {
  name?: string;
  email?: string;
  isActive?: boolean;
};

type RegisterClientInput = {
  name: string;
  email: string;
  password: string;
};

export const clientService = {
  async register(data: RegisterClientInput) {
    const existing = await userRepository.findByEmail(data.email);

    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: Role.CLIENT,
      mustChangePassword: false
    });

    return toSafeUser(user);
  },

  async list() {
    const clients = await userRepository.listByRole(Role.CLIENT);
    return clients.map(toSafeUser);
  },

  async update(id: string, data: UpdateClientInput) {
    const client = await userRepository.findById(id);

    if (!client || client.role !== Role.CLIENT) {
      throw new AppError("Client not found", 404);
    }

    if (data.email) {
      const emailOwner = await userRepository.findByEmail(data.email);
      if (emailOwner && emailOwner.id !== id) {
        throw new AppError("Email already in use", 409);
      }
    }

    const updated = await userRepository.update(id, data);
    return toSafeUser(updated);
  },

  async remove(id: string) {
    const client = await userRepository.findById(id);

    if (!client || client.role !== Role.CLIENT) {
      throw new AppError("Client not found", 404);
    }

    await userRepository.delete(id);
  }
};
