import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const serviceRepository = {
  create: (data: Prisma.ServiceCreateInput) => prisma.service.create({ data }),
  update: (id: string, data: Prisma.ServiceUpdateInput) =>
    prisma.service.update({ where: { id }, data }),
  findById: (id: string) => prisma.service.findUnique({ where: { id } }),
  list: (isActive?: boolean) =>
    prisma.service.findMany({
      where:
        typeof isActive === "boolean"
          ? { isActive }
          : undefined
    }),
  listActive: () =>
    prisma.service.findMany({
      where: { isActive: true, deletedAt: null }
    })
};
