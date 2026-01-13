import { Role, TicketStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ticketRepository } from "../repositories/ticketRepository";
import { technicianRepository } from "../repositories/technicianRepository";
import { serviceRepository } from "../repositories/serviceRepository";
import { AppError } from "../utils/appError";
import { userSelect } from "../utils/userSelect";

type CreateTicketInput = {
  title: string;
  description: string;
  technicianId: string;
  serviceIds: string[];
};

export const ticketService = {
  async createByClient(clientId: string, data: CreateTicketInput) {
    const technician = await technicianRepository.findById(data.technicianId);

    if (!technician || !technician.isActive) {
      throw new AppError("Technician not available", 404);
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: data.serviceIds },
        isActive: true,
        deletedAt: null
      }
    });

    if (services.length !== data.serviceIds.length) {
      throw new AppError("Some services are not available", 400);
    }

    return prisma.ticket.create({
      data: {
        clientId,
        technicianId: data.technicianId,
        title: data.title,
        description: data.description,
        status: TicketStatus.ABERTO,
        services: {
          create: services.map((service) => ({
            serviceId: service.id,
            serviceNameSnapshot: service.name,
            priceCentsSnapshot: service.priceCents,
            addedByRole: Role.CLIENT
          }))
        }
      },
      include: {
        services: true,
        technician: { select: userSelect },
        client: { select: userSelect }
      }
    });
  },

  async listByClient(clientId: string) {
    return ticketRepository.listByClient(clientId);
  },

  async listByTechnician(technicianId: string) {
    return ticketRepository.listByTechnician(technicianId);
  },

  async listAll() {
    return ticketRepository.listAll();
  },

  async updateStatusByAdmin(id: string, status: TicketStatus) {
    const existing = await ticketRepository.findById(id);

    if (!existing) {
      throw new AppError("Ticket not found", 404);
    }

    return ticketRepository.updateStatus(id, status);
  },

  async updateStatusByTechnician(
    id: string,
    technicianId: string,
    status: TicketStatus
  ) {
    const ticket = await prisma.ticket.findFirst({
      where: { id, technicianId },
      include: { services: true }
    });

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    if (status === TicketStatus.EM_ATENDIMENTO && ticket.status !== TicketStatus.ABERTO) {
      throw new AppError("Ticket must be open to start", 400);
    }

    if (status === TicketStatus.ENCERRADO && ticket.status !== TicketStatus.EM_ATENDIMENTO) {
      throw new AppError("Ticket must be in progress to close", 400);
    }

    return ticketRepository.updateStatus(id, status);
  },

  async addServiceByTechnician(
    id: string,
    technicianId: string,
    serviceId: string
  ) {
    const ticket = await prisma.ticket.findFirst({
      where: { id, technicianId }
    });

    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }

    const service = await serviceRepository.findById(serviceId);

    if (!service || !service.isActive || service.deletedAt) {
      throw new AppError("Service not available", 400);
    }

    await ticketRepository.addService({
      data: {
        ticketId: id,
        serviceId: service.id,
        serviceNameSnapshot: service.name,
        priceCentsSnapshot: service.priceCents,
        addedByRole: Role.TECH
      }
    });

    return ticketRepository.findById(id);
  }
};
