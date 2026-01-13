import { TechnicianProfile, User } from "@prisma/client";

type UserWithProfile = User & { technicianProfile?: TechnicianProfile | null };

export const toSafeUser = (user: UserWithProfile) => {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
};
