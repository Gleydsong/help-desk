import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../store/auth/useAuth";

import arrowLeftIcon from "../../assets/arrow-left.svg";

export function ClientChangePasswordModal() {
  const navigate = useNavigate();
  const { state, setAuth } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return current.length > 0 && next.length >= 6;
  }, [current.length, next.length]);

  function close() {
    navigate("/client/profile", { replace: true });
  }

  async function onSave() {
    if (!state.token) return;
    setError(null);
    try {
      await api.changePassword(state.token, {
        oldPassword: current,
        newPassword: next
      });
      const updatedUser = await api.getMe(state.token);
      setAuth({ token: state.token, user: updatedUser });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar senha.");
    }
  }

  return (
    <Modal
      open
      title="Alterar senha"
      onClose={close}
      maxWidthClassName="max-w-lg"
      footer={
        <button
          type="button"
          className="h-10 w-full rounded-lg bg-[#111827] text-sm font-semibold text-white disabled:opacity-60"
          disabled={!canSave}
          onClick={onSave}
        >
          Salvar
        </button>
      }
    >
      <div className="grid gap-4">
        <button
          type="button"
          onClick={close}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#111827]"
        >
          <img src={arrowLeftIcon} alt="" className="h-4 w-4 opacity-70" />
          Voltar
        </button>

        {error ? (
          <p className="text-sm text-[var(--feedback-danger)]">{error}</p>
        ) : null}

        <div className="grid gap-2">
          <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
            SENHA ATUAL
          </label>
          <input
            className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
            placeholder="Digite sua senha atual"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
            NOVA SENHA
          </label>
          <input
            className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
            placeholder="Digite sua nova senha"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <p className="m-0 text-[11px] text-[#9ca3af]">
            Minimo de 6 digitos
          </p>
        </div>
      </div>
    </Modal>
  );
}
