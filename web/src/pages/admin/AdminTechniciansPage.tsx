import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { Technician } from "../../services/types";
import { initialsFromName } from "../../utils/format";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../store/auth/useAuth";

import plusIcon from "../../assets/plus.svg";
import penIcon from "../../assets/pen-line.svg";

const hours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00"
];

export function AdminTechniciansPage() {
  const { state } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token) return;
      setError(null);
      try {
        const data = await api.admin.listTechnicians(state.token);
        if (active) setTechnicians(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar tecnicos.");
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token]);

  const canSave = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && availability.length > 0;
  }, [availability.length, email, name]);

  function openCreate() {
    setName("");
    setEmail("");
    setAvailability([]);
    setTempPassword(null);
    setCreateOpen(true);
  }

  function toggleHour(h: string) {
    setAvailability((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  }

  async function onSave() {
    if (!state.token) return;
    setError(null);
    try {
      const result = await api.admin.createTechnician(state.token, {
        name: name.trim(),
        email: email.trim(),
        availabilityTimes: availability
      });
      setTechnicians((prev) => [...prev, result.user]);
      setTempPassword(result.tempPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tecnico.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-(--blue-dark)">Tecnicos</h1>
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
        <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr_60px] gap-2 bg-[#fbfbfc] px-4 py-3 text-[11px] font-semibold text-[#6b7280]">
          <div>Nome</div>
          <div>E-mail</div>
          <div>Disponibilidade</div>
          <div />
        </div>
        <div className="divide-y divide-black/5">
          {technicians.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1.2fr_1.4fr_1.4fr_60px] items-center gap-2 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--blue-dark) text-[10px] font-bold text-white">
                  {initialsFromName(t.name)}
                </span>
                <span className="text-sm font-semibold text-[#111827]">
                  {t.name}
                </span>
              </div>
              <div className="text-xs text-[#6b7280]">{t.email}</div>
              <div className="flex flex-wrap gap-2">
                {(t.technicianProfile?.availabilityTimes ?? []).slice(0, 6).map((a) => (
                  <span
                    key={a}
                    className="inline-flex rounded-full border border-black/10 px-2 py-1 text-[11px] font-semibold text-[#111827]"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex justify-end">
                <Link
                  to={`/admin/technicians/${t.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 hover:bg-black/5"
                  aria-label="Editar"
                >
                  <img src={penIcon} alt="" className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={createOpen}
        title="Novo tecnico"
        onClose={() => setCreateOpen(false)}
        footer={
          <button
            type="button"
            className="h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white disabled:opacity-60"
            onClick={onSave}
            disabled={!canSave}
          >
            Salvar
          </button>
        }
        maxWidthClassName="max-w-xl"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              NOME COMPLETO
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
          <div>
            <p className="m-0 text-xs font-semibold text-[#6b7280]">
              Horarios de atendimento
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hours.map((h) => {
                const active = availability.includes(h);
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleHour(h)}
                    className={[
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                      active
                        ? "bg-(--blue-base) text-white"
                        : "border border-black/10 bg-white text-[#111827] hover:bg-black/5"
                    ].join(" ")}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>
          {tempPassword ? (
            <div className="rounded-lg border border-black/10 bg-black/5 p-3 text-sm">
              <p className="m-0 text-xs font-semibold text-[#6b7280]">
                Senha provisoria
              </p>
              <p className="m-0 mt-2 font-mono text-sm text-[#111827]">
                {tempPassword}
              </p>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
