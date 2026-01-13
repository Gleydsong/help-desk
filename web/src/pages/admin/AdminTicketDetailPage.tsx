import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import type { Ticket, TicketService, TicketStatus } from "../../services/types";
import { formatCurrencyBRL, formatDateTime, initialsFromName } from "../../utils/format";
import { StatusPill } from "../../components/ui/StatusPill";
import { useAuth } from "../../store/auth/useAuth";

import arrowLeftIcon from "../../assets/arrow-left.svg";
import clockIcon from "../../assets/clock-2.svg";
import checkIcon from "../../assets/check.svg";

function getServicesByRole(services: TicketService[], role: "CLIENT" | "TECH") {
  return services.filter((service) => service.addedByRole === role);
}

function ticketTotal(ticket: Ticket): number {
  if (typeof ticket.totalPriceCents === "number") {
    return ticket.totalPriceCents;
  }
  return ticket.services.reduce((sum, item) => sum + item.priceCentsSnapshot, 0);
}

export function AdminTicketDetailPage() {
  const { ticketId } = useParams();
  const { state } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token || !ticketId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.admin.listTickets(state.token);
        const found = data.find((item) => item.id === ticketId) ?? null;
        if (active) setTicket(found);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar chamado.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token, ticketId]);

  async function updateStatus(status: TicketStatus) {
    if (!state.token || !ticketId) return;
    try {
      const updated = await api.admin.updateTicketStatus(state.token, ticketId, status);
      setTicket(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status.");
    }
  }

  const requestedServices = useMemo(
    () => (ticket ? getServicesByRole(ticket.services, "CLIENT") : []),
    [ticket]
  );
  const addedServices = useMemo(
    () => (ticket ? getServicesByRole(ticket.services, "TECH") : []),
    [ticket]
  );

  if (isLoading) {
    return <p className="text-sm text-[#6b7280]">Carregando...</p>;
  }

  if (!ticket) {
    return (
      <div>
        <Link
          to="/admin/tickets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </Link>
        {error ? (
          <p className="mt-4 text-sm text-[var(--feedback-danger)]">{error}</p>
        ) : (
          <p className="mt-4 text-sm text-[#6b7280]">Chamado nao encontrado.</p>
        )}
      </div>
    );
  }

  const clientName = ticket.client?.name ?? "Cliente";
  const techName = ticket.technician?.name ?? "Tecnico";
  const techEmail = ticket.technician?.email ?? "";

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link
          to="/admin/tickets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-base font-semibold text-(--blue-dark)">
          Chamado detalhado
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827]"
            onClick={() => updateStatus("EM_ATENDIMENTO")}
          >
            <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
            Em atendimento
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827]"
            onClick={() => updateStatus("ENCERRADO")}
          >
            <img src={checkIcon} alt="" className="h-4 w-4 opacity-70" />
            Encerrado
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-black/5 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="m-0 font-mono text-xs text-[#6b7280]">{ticket.id}</p>
              <p className="m-0 mt-2 text-base font-semibold text-[#111827]">
                {ticket.title}
              </p>
            </div>
            <StatusPill status={ticket.status} />
          </div>

          <div className="mt-4 grid gap-4 text-sm">
            <div>
              <p className="m-0 text-xs font-semibold text-[#6b7280]">
                Descricao
              </p>
              <p className="m-0 mt-2 text-sm text-[#111827]">
                {ticket.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="m-0 text-xs font-semibold text-[#6b7280]">
                  Categoria
                </p>
                <p className="m-0 mt-2 text-sm font-semibold text-[#111827]">
                  {requestedServices[0]?.serviceNameSnapshot ?? "-"}
                </p>
              </div>
              <div>
                <p className="m-0 text-xs font-semibold text-[#6b7280]">
                  Atualizado em
                </p>
                <p className="m-0 mt-2 text-sm font-semibold text-[#111827]">
                  {formatDateTime(ticket.updatedAt)}
                </p>
              </div>
            </div>
            <div>
              <p className="m-0 text-xs font-semibold text-[#6b7280]">Cliente</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--blue-dark) text-[10px] font-bold text-white">
                  {initialsFromName(clientName)}
                </span>
                <p className="m-0 text-sm font-semibold text-[#111827]">
                  {clientName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">
              Tecnico responsavel
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-xs font-bold text-white">
                {initialsFromName(techName)}
              </span>
              <div>
                <p className="m-0 text-sm font-semibold text-[#111827]">
                  {techName}
                </p>
                <p className="m-0 text-xs text-[#6b7280]">{techEmail}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">Valores</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Preco base</span>
                <span className="font-semibold text-[#111827]">
                  {formatCurrencyBRL(
                    requestedServices.reduce(
                      (sum, item) => sum + item.priceCentsSnapshot,
                      0
                    )
                  )}
                </span>
              </div>
              {addedServices.length ? (
                <div className="pt-2">
                  <p className="m-0 text-xs font-semibold text-[#6b7280]">
                    Adicionais
                  </p>
                  <div className="mt-2 space-y-2">
                    {addedServices.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[#111827]">
                          {s.serviceNameSnapshot}
                        </span>
                        <span className="text-[#6b7280]">
                          {formatCurrencyBRL(s.priceCentsSnapshot)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-3 border-t border-black/5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111827]">
                    Total
                  </span>
                  <span className="text-sm font-bold text-[#111827]">
                    {formatCurrencyBRL(ticketTotal(ticket))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
