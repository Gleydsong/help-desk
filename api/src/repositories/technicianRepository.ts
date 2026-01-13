import { prisma } from "../lib/prisma";
import { Prisma, Role } from "@prisma/client";

export const technicianRepository = {
  create: (data: Prisma.UserCreateInput) =>
    prisma.user.create({
      data,
      include: { technicianProfile: true }
    }),
  list: () =>
    prisma.user.findMany({
      where: { role: Role.TECH },
      include: { technicianProfile: true }
    }),
  listActive: () =>
    prisma.user.findMany({
      where: { role: Role.TECH, isActive: true },
      include: { technicianProfile: true }
    }),
  findById: (id: string) =>
    prisma.user.findFirst({
      where: { id, role: Role.TECH },
      include: { technicianProfile: true }
    }),
  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({
      where: { id },
      data,
      include: { technicianProfile: true }
    })
};
