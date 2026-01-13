import { Link, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { api } from "../../services/api";
import type { Technician } from "../../services/types";
import { initialsFromName } from "../../utils/format";
import { useAuth } from "../../store/auth/useAuth";

import arrowLeftIcon from "../../assets/arrow-left.svg";

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

export function AdminTechnicianProfilePage() {
  const { technicianId } = useParams();
  const { state } = useAuth();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!state.token || !technicianId) return;
      setError(null);
      try {
        const data = await api.admin.listTechnicians(state.token);
        const found = data.find((item) => item.id === technicianId) ?? null;
        if (active) {
          setTechnician(found);
          setName(found?.name ?? "");
          setEmail(found?.email ?? "");
          setAvailability(found?.technicianProfile?.availabilityTimes ?? []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar tecnico.");
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [state.token, technicianId]);

  const hasChanges = useMemo(() => {
    if (!technician) return false;
    return (
      name !== technician.name ||
      email !== technician.email ||
      availability.join(",") !==
        (technician.technicianProfile?.availabilityTimes ?? []).join(",")
    );
  }, [availability, email, name, technician]);

  function toggleHour(h: string) {
    setAvailability((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  }

  async function onSave() {
    if (!state.token || !technicianId) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await api.admin.updateTechnician(state.token, technicianId, {
        name,
        email,
        availabilityTimes: availability
      });
      setTechnician(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar tecnico.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!technician) {
    return (
      <div>
        <Link
          to="/admin/technicians"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </Link>
        {error ? (
          <p className="mt-4 text-sm text-[var(--feedback-danger)]">{error}</p>
        ) : (
          <p className="mt-4 text-sm text-[#6b7280]">Tecnico nao encontrado.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          to="/admin/technicians"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </Link>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827]">
            Cancelar
          </button>
          <button
            className="rounded-lg bg-[#111827] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            disabled={!hasChanges || isSaving}
            onClick={onSave}
          >
            Salvar
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--feedback-danger)]">{error}</p>
      ) : null}

      <h1 className="mt-3 text-base font-semibold text-(--blue-dark)">
        Perfil de tecnico
      </h1>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/5 p-5">
          <p className="m-0 text-xs font-semibold text-[#6b7280]">
            Dados pessoais
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--blue-dark) text-xs font-bold text-white">
              {initialsFromName(name)}
            </span>
            <p className="m-0 text-sm font-semibold text-[#111827]">{name}</p>
          </div>

          <div className="mt-4 grid gap-4">
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
          </div>
        </div>

        <div className="rounded-xl border border-black/5 p-5">
          <p className="m-0 text-xs font-semibold text-[#6b7280]">
            Horarios de atendimento
          </p>
          <p className="m-0 mt-2 text-xs text-[#6b7280]">
            Selecione os horarios em que o tecnico deve atuar para receber
            chamados.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
