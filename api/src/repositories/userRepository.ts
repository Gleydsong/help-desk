import { Prisma, Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      include: { technicianProfile: true }
    }),
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      include: { technicianProfile: true }
    }),
  listByRole: (role: Role) => prisma.user.findMany({ where: { role } }),
  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({
      where: { id },
      data,
      include: { technicianProfile: true }
    }),
  delete: (id: string) => prisma.user.delete({ where: { id } }),
  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data })
};
