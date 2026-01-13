import type { AuthUser, Service, Technician, Ticket, TicketStatus } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

type ApiError = {
  message?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as ApiError) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

function jsonRequest<T>(
  path: string,
  body: unknown,
  token?: string | null,
  method = "POST"
): Promise<T> {
  return request<T>(path, {
    method,
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

export const api = {
  login: (input: { email: string; password: string }) =>
    jsonRequest<{ token: string; user: AuthUser }>("/auth/login", input),
  registerClient: (input: { name: string; email: string; password: string }) =>
    jsonRequest<AuthUser>("/client/register", input),
  changePassword: (token: string, input: { oldPassword: string; newPassword: string }) =>
    jsonRequest<void>("/auth/change-password", input, token),
  getMe: (token: string) => request<AuthUser>("/me", { token }),
  updateMe: (
    token: string,
    input: { name?: string; email?: string }
  ) => jsonRequest<AuthUser>("/me", input, token, "PUT"),
  uploadAvatar: (token: string, file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return request<AuthUser>("/me/avatar", {
      method: "POST",
      token,
      body: formData
    });
  },
  admin: {
    listServices: (token: string, isActive?: boolean) => {
      const query = typeof isActive === "boolean" ? `?isActive=${isActive}` : "";
      return request<Service[]>(`/admin/services${query}`, { token });
    },
    createService: (
      token: string,
      input: { name: string; description?: string; priceCents: number }
    ) => jsonRequest<Service>("/admin/services", input, token),
    createTechnician: (
      token: string,
      input: { name: string; email: string; availabilityTimes: string[] }
    ) =>
      jsonRequest<{ user: Technician; tempPassword: string }>(
        "/admin/technicians",
        input,
        token
      ),
    updateService: (
      token: string,
      id: string,
      input: { name?: string; description?: string | null; priceCents?: number; isActive?: boolean }
    ) => jsonRequest<Service>(`/admin/services/${id}`, input, token, "PUT"),
    deactivateService: (token: string, id: string) =>
      request<Service>(`/admin/services/${id}/deactivate`, {
        method: "PATCH",
        token
      }),
    listTechnicians: (token: string) =>
      request<Technician[]>("/admin/technicians", { token }),
    updateTechnician: (
      token: string,
      id: string,
      input: { name?: string; email?: string; availabilityTimes?: string[]; isActive?: boolean }
    ) => jsonRequest<Technician>(`/admin/technicians/${id}`, input, token, "PUT"),
    listClients: (token: string) => request<AuthUser[]>("/admin/clients", { token }),
    updateClient: (
      token: string,
      id: string,
      input: { name?: string; email?: string; isActive?: boolean }
    ) => jsonRequest<AuthUser>(`/admin/clients/${id}`, input, token, "PUT"),
    deleteClient: (token: string, id: string) =>
      request<void>(`/admin/clients/${id}`, { method: "DELETE", token }),
    listTickets: (token: string) => request<Ticket[]>("/admin/tickets", { token }),
    updateTicketStatus: (
      token: string,
      id: string,
      status: TicketStatus
    ) => jsonRequest<Ticket>(`/admin/tickets/${id}/status`, { status }, token, "PATCH")
  },
  tech: {
    listTickets: (token: string) => request<Ticket[]>("/tech/tickets", { token }),
    updateTicketStatus: (
      token: string,
      id: string,
      status: TicketStatus
    ) => jsonRequest<Ticket>(`/tech/tickets/${id}/status`, { status }, token, "PATCH"),
    addTicketService: (token: string, id: string, serviceId: string) =>
      jsonRequest<Ticket>(`/tech/tickets/${id}/services`, { serviceId }, token),
    listServices: (token: string) => request<Service[]>("/tech/services", { token })
  },
  client: {
    listTickets: (token: string) => request<Ticket[]>("/client/tickets", { token }),
    createTicket: (
      token: string,
      input: {
        title: string;
        description: string;
        technicianId: string;
        serviceIds: string[];
      }
    ) => jsonRequest<Ticket>("/client/tickets", input, token),
    listServices: (token: string) => request<Service[]>("/client/services", { token }),
    listTechnicians: (token: string) =>
      request<Technician[]>("/client/technicians", { token })
  }
};
