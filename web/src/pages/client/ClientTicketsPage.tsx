import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusPill } from "../../components/ui/StatusPill";
import { formatCurrencyBRL, formatDateTime } from "../../utils/format";
import { api } from "../../services/api";
import type { Ticket } from "../../services/types";
import { useAuth } from "../../store/auth/useAuth";

import plusIcon from "../../assets/plus.svg";

function ticketTotal(ticket: Ticket): number {
  if (typeof ticket.totalPriceCents === "number") {
    return ticket.totalPriceCents;
  }
  return ticket.services.reduce((sum, item) => sum + item.priceCentsSnapshot, 0);
}

export function ClientTicketsPage() {
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
        const data = await api.client.listTickets(state.token);
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

  const hasTickets = useMemo(() => tickets.length > 0, [tickets.length]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-(--blue-dark)">
            Meus chamados
          </h1>
          <p className="m-0 mt-1 text-xs text-[#6b7280]">
            Acompanhe seus chamados e status
          </p>
        </div>

        <Link
          to="/client/tickets/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white"
        >
          <img
            src={plusIcon}
            alt=""
            className="h-4 w-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          Novo chamado
        </Link>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 hidden overflow-hidden rounded-xl border border-black/5 sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-black/3">
            <tr className="border-b border-black/5">
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Codigo
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Problema
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Categoria
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Atualizado
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Valor
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6b7280]">
                Acao
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-sm text-[#6b7280]">
                  Carregando...
                </td>
              </tr>
            ) : hasTickets ? (
              tickets.map((t) => (
                <tr key={t.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">
                    {t.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#111827]">
                    {t.title}
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {t.services[0]?.serviceNameSnapshot ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">
                    {formatDateTime(t.updatedAt)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#111827]">
                    {formatCurrencyBRL(ticketTotal(t))}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/client/tickets/${t.id}`}
                      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-black/5"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-sm text-[#6b7280]">
                  Nenhum chamado encontrado para este usuario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 sm:hidden">
        {isLoading ? (
          <div className="rounded-xl border border-black/5 p-4 text-sm text-[#6b7280]">
            Carregando...
          </div>
        ) : hasTickets ? (
          tickets.map((t) => (
            <div key={t.id} className="rounded-xl border border-black/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 font-mono text-xs text-[#6b7280]">{t.id}</p>
                  <p className="m-0 mt-1 text-sm font-semibold text-[#111827]">
                    {t.title}
                  </p>
                  <p className="m-0 mt-1 text-xs text-[#6b7280]">
                    {t.services[0]?.serviceNameSnapshot ?? "-"}
                  </p>
                </div>
                <StatusPill status={t.status} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="m-0 text-xs text-[#6b7280]">
                    {formatDateTime(t.updatedAt)}
                  </p>
                  <p className="m-0 mt-1 text-xs font-semibold text-[#111827]">
                    {formatCurrencyBRL(ticketTotal(t))}
                  </p>
                </div>
                <Link
                  to={`/client/tickets/${t.id}`}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-black/5"
                >
                  Detalhes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-black/5 p-4 text-sm text-[#6b7280]">
            Nenhum chamado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
