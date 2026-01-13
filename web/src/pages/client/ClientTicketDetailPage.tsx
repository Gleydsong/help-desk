import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StatusPill } from "../../components/ui/StatusPill";
import { api } from "../../services/api";
import type { Ticket, TicketService } from "../../services/types";
import { formatCurrencyBRL, formatDateTime, initialsFromName } from "../../utils/format";
import { useAuth } from "../../store/auth/useAuth";

import arrowLeftIcon from "../../assets/arrow-left.svg";

function getServicesByRole(services: TicketService[], role: "CLIENT" | "TECH") {
  return services.filter((service) => service.addedByRole === role);
}

export function ClientTicketDetailPage() {
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
        const data = await api.client.listTickets(state.token);
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
          to="/client/tickets"
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

  const basePriceCents = requestedServices.reduce(
    (acc, s) => acc + s.priceCentsSnapshot,
    0
  );
  const additionalTotalCents = addedServices.reduce(
    (acc, s) => acc + s.priceCentsSnapshot,
    0
  );
  const totalCents = basePriceCents + additionalTotalCents;

  const clientName = ticket.client?.name ?? state.user?.name ?? "Cliente";

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link
          to="/client/tickets"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-base font-semibold text-(--blue-dark)">
            Chamado detalhado
          </h1>
          <p className="m-0 mt-1 font-mono text-xs text-[#6b7280]">
            {ticket.id}
          </p>
        </div>
        <StatusPill status={ticket.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-black/5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="m-0 mt-1 text-base font-semibold text-[#111827]">
                {ticket.title}
              </p>
              <p className="m-0 mt-1 text-xs text-[#6b7280]">
                {requestedServices[0]?.serviceNameSnapshot ?? "-"}
              </p>
            </div>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="m-0 text-xs font-semibold text-[#6b7280]">
                  Atualizado em
                </p>
                <p className="m-0 mt-2 text-sm font-semibold text-[#111827]">
                  {formatDateTime(ticket.updatedAt)}
                </p>
              </div>
              <div>
                <p className="m-0 text-xs font-semibold text-[#6b7280]">
                  Cliente
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--blue-dark) text-xxs font-bold text-white">
                    {initialsFromName(clientName)}
                  </span>
                  <p className="m-0 text-sm font-semibold text-[#111827]">
                    {clientName}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="m-0 text-xs font-semibold text-[#6b7280]">
                Servicos solicitados
              </p>
              <div className="mt-2 space-y-2">
                {requestedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-black/5 px-3 py-2"
                  >
                    <span className="text-sm font-semibold text-[#111827]">
                      {s.serviceNameSnapshot}
                    </span>
                    <span className="text-xs font-semibold text-[#6b7280]">
                      {formatCurrencyBRL(s.priceCentsSnapshot)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {addedServices.length ? (
              <div>
                <p className="m-0 text-xs font-semibold text-[#6b7280]">
                  Servicos adicionais
                </p>
                <div className="mt-2 space-y-2">
                  {addedServices.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border border-black/5 px-3 py-2"
                    >
                      <span className="text-sm font-semibold text-[#111827]">
                        {s.serviceNameSnapshot}
                      </span>
                      <span className="text-xs font-semibold text-[#6b7280]">
                        {formatCurrencyBRL(s.priceCentsSnapshot)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">
              Tecnico responsavel
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-xs font-bold text-white">
                {initialsFromName(ticket.technician?.name ?? "Tecnico")}
              </span>
              <div>
                <p className="m-0 text-sm font-semibold text-[#111827]">
                  {ticket.technician?.name ?? "Tecnico"}
                </p>
                <p className="m-0 text-xs text-[#6b7280]">
                  {ticket.technician?.email ?? ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">Valores</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Preco base</span>
                <span className="font-semibold text-[#111827]">
                  {formatCurrencyBRL(basePriceCents)}
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
                    {formatCurrencyBRL(totalCents)}
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
