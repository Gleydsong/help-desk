import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Ticket } from "../../services/types";
import { formatCurrencyBRL, formatDateTime, initialsFromName } from "../../utils/format";
import { StatusPill } from "../../components/ui/StatusPill";
import { useAuth } from "../../store/auth/useAuth";

import eyeIcon from "../../assets/eye.svg";

function ticketTotal(ticket: Ticket): number {
  if (typeof ticket.totalPriceCents === "number") {
    return ticket.totalPriceCents;
  }
  return ticket.services.reduce((sum, item) => sum + item.priceCentsSnapshot, 0);
}

export function AdminTicketsPage() {
  const { state } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.admin.listTickets(state.token);
        if (active) setTickets(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar chamados.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-(--blue-dark)">Chamados</h1>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-[#6b7280]">Atualizado em</span>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
        <div className="hidden grid-cols-[130px_80px_1.6fr_140px_140px_140px_120px_60px] gap-2 bg-[#fbfbfc] px-4 py-3 text-[11px] font-semibold text-[#6b7280] sm:grid">
          <div>Atualizado em</div>
          <div>ID</div>
          <div>Titulo e Servico</div>
          <div>Valor total</div>
          <div>Cliente</div>
          <div>Tecnico</div>
          <div>Status</div>
          <div />
        </div>

        <div className="divide-y divide-black/5">
          {isLoading ? (
            <div className="px-4 py-6 text-sm text-[#6b7280]">Carregando...</div>
          ) : tickets.length ? (
            tickets.map((t) => {
              const category = t.services[0]?.serviceNameSnapshot ?? "-";
              const clientName = t.client?.name ?? "Cliente";
              const techName = t.technician?.name ?? "Tecnico";

              return (
                <div
                  key={t.id}
                  className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-[130px_80px_1.6fr_140px_140px_140px_120px_60px] sm:items-center"
                >
                  <div className="text-xs text-[#374151]">
                    {formatDateTime(t.updatedAt)}
                  </div>
                  <div className="font-mono text-xs text-[#374151]">{t.id}</div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#111827]">
                      {t.title}
                    </p>
                    <p className="m-0 text-xs text-[#6b7280]">{category}</p>
                  </div>
                  <div className="text-sm font-semibold text-[#111827]">
                    {formatCurrencyBRL(ticketTotal(t))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--blue-dark) text-[10px] font-bold text-white">
                      {initialsFromName(clientName)}
                    </span>
                    <span className="text-xs font-semibold text-[#111827]">
                      {clientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white">
                      {initialsFromName(techName)}
                    </span>
                    <span className="text-xs font-semibold text-[#111827]">
                      {techName}
                    </span>
                  </div>
                  <div>
                    <StatusPill status={t.status} />
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to={`/admin/tickets/${t.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                      aria-label="Ver detalhes"
                    >
                      <img src={eyeIcon} alt="" className="h-4 w-4 opacity-70" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-sm text-[#6b7280]">
              Nenhum chamado encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
