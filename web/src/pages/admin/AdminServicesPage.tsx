import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import type { Service } from "../../services/types";
import { formatCurrencyBRL } from "../../utils/format";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../store/auth/useAuth";

import plusIcon from "../../assets/plus.svg";
import eyeIcon from "../../assets/eye.svg";
import penIcon from "../../assets/pen-line.svg";
import banIcon from "../../assets/ban.svg";

export function AdminServicesPage() {
  const { state } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token) return;
      setError(null);
      try {
        const data = await api.admin.listServices(state.token);
        if (active) setServices(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar servicos.");
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token]);

  const modalTitle = useMemo(() => {
    return editing ? "Servico" : "Cadastro de servico";
  }, [editing]);

  function openCreate() {
    setEditing(null);
    setTitle("");
    setPrice("");
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setTitle(service.name);
    setPrice((service.priceCents / 100).toFixed(2).replace(".", ","));
    setModalOpen(true);
  }

  async function onSave() {
    if (!state.token) return;
    const normalized = Number(price.replace(".", "").replace(",", "."));
    const cents = Number.isFinite(normalized)
      ? Math.round(normalized * 100)
      : 0;
    if (!title.trim()) return;

    try {
      if (editing) {
        const updated = await api.admin.updateService(state.token, editing.id, {
          name: title.trim(),
          priceCents: cents
        });
        setServices((prev) =>
          prev.map((service) => (service.id === editing.id ? updated : service))
        );
      } else {
        const created = await api.admin.createService(state.token, {
          name: title.trim(),
          priceCents: cents
        });
        setServices((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar servico.");
    }
  }

  async function deactivate(service: Service) {
    if (!state.token || !service.isActive) return;
    try {
      const updated = await api.admin.deactivateService(state.token, service.id);
      setServices((prev) =>
        prev.map((item) => (item.id === service.id ? updated : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao desativar servico.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-(--blue-dark)">Servicos</h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white"
          onClick={openCreate}
        >
          <img
            src={plusIcon}
            alt=""
            className="h-4 w-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          Novo
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
        <div className="grid grid-cols-[1.6fr_140px_120px_140px] gap-2 bg-[#fbfbfc] px-4 py-3 text-[11px] font-semibold text-[#6b7280]">
          <div>Titulo</div>
          <div>Valor</div>
          <div>Status</div>
          <div />
        </div>
        <div className="divide-y divide-black/5">
          {services.map((service) => (
            <div
              key={service.id}
              className="grid grid-cols-[1.6fr_140px_120px_140px] items-center gap-2 px-4 py-3"
            >
              <div className="text-sm font-semibold text-[#111827]">
                {service.name}
              </div>
              <div className="text-sm font-semibold text-[#111827]">
                {formatCurrencyBRL(service.priceCents)}
              </div>
              <div>
                <span
                  className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: service.isActive
                      ? "rgba(80,139,38,0.14)"
                      : "rgba(208,62,62,0.14)",
                    color: service.isActive
                      ? "var(--feedback-done)"
                      : "var(--feedback-danger)"
                  }}
                >
                  {service.isActive ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                  aria-label="Visualizar"
                  onClick={() => openEdit(service)}
                >
                  <img src={eyeIcon} alt="" className="h-4 w-4 opacity-70" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                  aria-label="Editar"
                  onClick={() => openEdit(service)}
                >
                  <img src={penIcon} alt="" className="h-4 w-4 opacity-70" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-black/5 px-3 text-xs font-semibold text-[#111827] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => deactivate(service)}
                  disabled={!service.isActive}
                >
                  <img src={banIcon} alt="" className="h-4 w-4 opacity-70" />
                  Desativar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
        footer={
          <button
            type="button"
            className="h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white"
            onClick={onSave}
          >
            Salvar
          </button>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              TITULO
            </label>
            <input
              className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do servico"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              VALOR
            </label>
            <input
              className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
