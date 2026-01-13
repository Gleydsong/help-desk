import type { Role } from "../../services/types";

export type { Role };

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  isActive?: boolean;
  mustChangePassword?: boolean;
  technicianProfile?: { availabilityTimes: string[] } | null;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
};
