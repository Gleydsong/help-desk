import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../store/auth/useAuth";
import { initialsFromName } from "../../utils/format";
import { api } from "../../services/api";

import uploadIcon from "../../assets/upload.svg";
import trashIcon from "../../assets/trash.svg";

export function ClientProfileModal() {
  const navigate = useNavigate();
  const { state, setAuth } = useAuth();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(state.user?.name ?? "Usuario");
  const [email, setEmail] = useState(state.user?.email ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    state.user?.avatarUrl ?? null
  );
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0;
  }, [email, name]);

  function close() {
    navigate("/client/tickets", { replace: true });
  }

  function onPickImage() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSave() {
    if (!canSave || !state.user || !state.token) return;
    setError(null);
    try {
      let updated = await api.updateMe(state.token, {
        name: name.trim(),
        email: email.trim()
      });
      if (avatarFile) {
        updated = await api.uploadAvatar(state.token, avatarFile);
      }
      setAuth({ token: state.token, user: updated });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil.");
    }
  }

  return (
    <Modal
      open
      title="Perfil"
      onClose={close}
      maxWidthClassName="max-w-2xl"
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
      <div className="grid gap-5">
        {error ? (
          <p className="text-sm text-[var(--feedback-danger)]">{error}</p>
        ) : null}

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-(--blue-dark) text-xs font-bold text-white">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="h-10 w-10 object-cover" />
            ) : (
              initialsFromName(name)
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPickImage}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-black/5"
            >
              <img src={uploadIcon} alt="" className="h-4 w-4 opacity-70" />
              Nova imagem
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white hover:bg-black/5"
              aria-label="Remover"
            >
              <img src={trashIcon} alt="" className="h-4 w-4 opacity-70" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>

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
          <div className="grid gap-2">
            <label className="text-[11px] font-semibold tracking-widest text-[#6b7280]">
              SENHA
            </label>
            <div className="flex items-end justify-between gap-3">
              <input
                className="h-10 w-full border-b border-black/10 bg-transparent text-sm outline-none"
                value="********"
                readOnly
              />
              <button
                type="button"
                onClick={() => navigate("/client/profile/password")}
                className="mb-1 rounded-md bg-black/5 px-3 py-1 text-[11px] font-semibold text-[#111827] hover:bg-black/10"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
