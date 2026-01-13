import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Ticket } from "../../services/types";
import { StatusPill } from "../../components/ui/StatusPill";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../../store/auth/useAuth";

export function TechTicketsPage() {
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
        const data = await api.tech.listTickets(state.token);
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
        <h1 className="text-base font-semibold text-(--blue-dark)">
          Meus chamados
        </h1>
        <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[#111827]">
          {tickets.length}
        </span>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="text-sm text-[#6b7280]">Carregando...</div>
        ) : tickets.length ? (
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
                <p className="m-0 text-xs text-[#6b7280]">
                  {formatDateTime(t.updatedAt)}
                </p>
                <Link
                  to={`/tech/tickets/${t.id}`}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-black/5"
                >
                  Detalhes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-[#6b7280]">Nenhum chamado encontrado.</div>
        )}
      </div>
    </div>
  );
}
