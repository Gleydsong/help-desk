import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { formatCurrencyBRL } from "../../utils/format";
import type { Service } from "../../services/types";

type Props = {
  open: boolean;
  services: Service[];
  onClose(): void;
  onSave(serviceId: string): void;
};

export function TechAdditionalServiceModal({
  open,
  services,
  onClose,
  onSave
}: Props) {
  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    if (!serviceId && services.length) {
      setServiceId(services[0].id);
    }
  }, [serviceId, services]);

  const selected = useMemo(
    () => services.find((o) => o.id === serviceId),
    [serviceId, services]
  );

  function handleSave() {
    if (!selected) return;
    onSave(selected.id);
    onClose();
  }

  const footer = (
    <button
      type="button"
      onClick={handleSave}
      disabled={!selected}
      className="w-full rounded-lg bg-[#111827] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
    >
      Salvar
    </button>
  );

  return (
    <Modal
      open={open}
      title="Servico adicional"
      onClose={onClose}
      footer={footer}
      maxWidthClassName="max-w-sm"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-xs font-semibold text-[#6b7280]">
            Servico
          </label>
          {services.length ? (
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#111827]"
            >
              {services.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-2 text-xs text-[#6b7280]">
              Nenhum servico disponivel.
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-[#6b7280]">Valor</label>
          <p className="mt-2 text-sm font-semibold text-[#111827]">
            {selected ? formatCurrencyBRL(selected.priceCents) : "-"}
          </p>
        </div>
      </div>
    </Modal>
  );
}
