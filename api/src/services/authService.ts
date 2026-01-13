import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/appError";
import { toSafeUser } from "../utils/userView";

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.isActive) {
      throw new AppError("Invalid credentials", 401);
    }

    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { role: user.role },
      jwtConfig.secret,
      {
        subject: user.id,
        expiresIn: jwtConfig.expiresIn
      }
    );

    return {
      token,
      user: toSafeUser(user)
    };
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const matches = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!matches) {
      throw new AppError("Invalid current password", 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userRepository.update(userId, {
      passwordHash,
      mustChangePassword: false
    });
  }
};
