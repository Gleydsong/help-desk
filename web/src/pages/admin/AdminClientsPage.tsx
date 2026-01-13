import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { AuthUser } from "../../services/types";
import { initialsFromName } from "../../utils/format";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../store/auth/useAuth";

import penIcon from "../../assets/pen-line.svg";
import trashIcon from "../../assets/trash.svg";

export function AdminClientsPage() {
  const { state } = useAuth();
  const [clients, setClients] = useState<AuthUser[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token) return;
      setError(null);
      try {
        const data = await api.admin.listClients(state.token);
        if (active) setClients(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar clientes.");
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token]);

  function openEdit(c: AuthUser) {
    setSelected(c);
    setName(c.name);
    setEmail(c.email);
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!selected || !state.token) return;
    try {
      const updated = await api.admin.updateClient(state.token, selected.id, {
        name,
        email
      });
      setClients((prev) => prev.map((c) => (c.id === selected.id ? updated : c)));
      setEditOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar cliente.");
    }
  }

  function openDelete(c: AuthUser) {
    setSelected(c);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!selected || !state.token) return;
    try {
      await api.admin.deleteClient(state.token, selected.id);
      setClients((prev) => prev.filter((c) => c.id !== selected.id));
      setDeleteOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir cliente.");
    }
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-(--blue-dark)">Clientes</h1>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-black/5">
        <div className="grid grid-cols-[1.4fr_1.8fr_120px] gap-2 bg-[#fbfbfc] px-4 py-3 text-[11px] font-semibold text-[#6b7280]">
          <div>Nome</div>
          <div>E-mail</div>
          <div />
        </div>
        <div className="divide-y divide-black/5">
          {clients.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[1.4fr_1.8fr_120px] items-center gap-2 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--blue-dark) text-[10px] font-bold text-white">
                  {initialsFromName(c.name)}
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  {c.name}
                </span>
              </div>
              <div className="text-xs text-[#6b7280]">{c.email}</div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                  aria-label="Editar"
                  onClick={() => openEdit(c)}
                >
                  <img src={penIcon} alt="" className="h-4 w-4 opacity-70" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                  aria-label="Excluir"
                  onClick={() => openDelete(c)}
                >
                  <img src={trashIcon} alt="" className="h-4 w-4 opacity-70" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={editOpen}
        title="Cliente"
        onClose={() => setEditOpen(false)}
        footer={
          <button
            type="button"
            className="h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white"
            onClick={saveEdit}
          >
            Salvar
          </button>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              NOME
            </label>
            <input
              className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              E-MAIL
            </label>
            <input
              className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteOpen}
        title="Excluir cliente"
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="h-10 rounded-lg border border-black/10 bg-white px-4 text-sm font-semibold"
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="h-10 rounded-lg bg-[#111827] px-4 text-sm font-semibold text-white"
              onClick={confirmDelete}
            >
              Sim, excluir
            </button>
          </>
        }
      >
        <p className="m-0 text-sm text-[#111827]">
          Deseja realmente excluir{" "}
          <strong>{selected?.name ?? "este cliente"}</strong>?
        </p>
        <p className="m-0 mt-2 text-xs text-[#6b7280]">
          Ao excluir, todos os chamados deste cliente serao removidos e nao
          poderao ser desfeitos.
        </p>
      </Modal>
    </div>
  );
}
