import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/appError";
import { toSafeUser } from "../utils/userView";

export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toSafeUser(user);
  },

  async update(id: string, data: { name?: string; email?: string }) {
    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already in use", 409);
      }
    }

    const user = await userRepository.update(id, data);
    return toSafeUser(user);
  },

  async updateAvatar(id: string, avatarUrl: string) {
    const user = await userRepository.update(id, { avatarUrl });
    return toSafeUser(user);
  },

  async remove(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await userRepository.delete(id);
  }
};
