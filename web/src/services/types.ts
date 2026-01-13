export type Role = "ADMIN" | "TECH" | "CLIENT";

export type TicketStatus = "ABERTO" | "EM_ATENDIMENTO" | "ENCERRADO";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  isActive?: boolean;
  mustChangePassword?: boolean;
  technicianProfile?: TechnicianProfile | null;
};

export type TechnicianProfile = {
  availabilityTimes: string[];
};

export type Technician = AuthUser & {
  technicianProfile?: TechnicianProfile | null;
};

export type Service = {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  isActive: boolean;
  deletedAt?: string | null;
};

export type TicketService = {
  id: string;
  serviceId?: string | null;
  serviceNameSnapshot: string;
  priceCentsSnapshot: number;
  addedByRole: Role;
  createdAt: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  services: TicketService[];
  client?: AuthUser;
  technician?: AuthUser;
  totalPriceCents?: number;
};
