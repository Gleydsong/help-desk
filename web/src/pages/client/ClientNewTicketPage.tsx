import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { Service, Technician } from "../../services/types";
import { formatCurrencyBRL } from "../../utils/format";
import { useAuth } from "../../store/auth/useAuth";

import arrowLeftIcon from "../../assets/arrow-left.svg";

export function ClientNewTicketPage() {
  const navigate = useNavigate();
  const { state } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token) return;
      setIsLoading(true);
      setError(null);
      try {
        const [serviceData, techData] = await Promise.all([
          api.client.listServices(state.token),
          api.client.listTechnicians(state.token)
        ]);
        if (active) {
          setServices(serviceData);
          setTechnicians(techData);
          if (!serviceId && serviceData.length) {
            setServiceId(serviceData[0].id);
          }
          if (!technicianId && techData.length) {
            setTechnicianId(techData[0].id);
          }
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
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

  const selectedService = useMemo(() => {
    return services.find((s) => s.id === serviceId) ?? null;
  }, [services, serviceId]);

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    Boolean(selectedService) &&
    Boolean(technicianId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedService || !state.token) return;

    try {
      const ticket = await api.client.createTicket(state.token, {
        title: title.trim(),
        description: description.trim(),
        technicianId,
        serviceIds: [selectedService.id]
      });
      navigate(`/client/tickets/${ticket.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar chamado.");
    }
  }

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

      <div className="mt-3 flex flex-col gap-1">
        <h1 className="text-base font-semibold text-(--blue-dark)">
          Novo chamado
        </h1>
        <p className="m-0 text-xs text-[#6b7280]">
          Descreva o problema e selecione o servico
        </p>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]"
      >
        <div className="rounded-xl border border-black/5 p-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
                TITULO
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Backup nao esta funcionando"
                className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
                SERVICO
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-[#111827]"
              >
                {services
                  .filter((s) => s.isActive)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
                TECNICO
              </label>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-[#111827]"
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
                DESCRICAO
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explique o que esta acontecendo..."
                className="min-h-[120px] w-full resize-none rounded-lg border border-black/10 bg-white p-3 text-sm text-[#111827] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">Resumo</p>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Servico</span>
                <span className="font-semibold text-[#111827]">
                  {selectedService?.name ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Valor</span>
                <span className="font-semibold text-[#111827]">
                  {formatCurrencyBRL(selectedService?.priceCents ?? 0)}
                </span>
              </div>
              <div className="mt-3 border-t border-black/5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111827]">
                    Total
                  </span>
                  <span className="text-sm font-bold text-[#111827]">
                    {formatCurrencyBRL(selectedService?.priceCents ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="mt-4 h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white disabled:opacity-60"
            >
              Abrir chamado
            </button>
          </div>

          <div className="rounded-xl border border-black/5 p-5">
            <p className="m-0 text-xs font-semibold text-[#6b7280]">Dica</p>
            <p className="m-0 mt-2 text-sm text-[#111827]">
              Inclua detalhes (mensagens de erro, quando comecou e o que ja
              tentou) para agilizar o atendimento.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
