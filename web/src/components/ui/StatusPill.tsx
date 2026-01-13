import type { TicketStatus } from "../../services/types";

type Props = {
  status: TicketStatus;
};

const stylesByStatus: Record<TicketStatus, { bg: string; fg: string }> = {
  ABERTO: { bg: "rgba(204, 61, 106, 0.14)", fg: "var(--feedback-open)" },
  EM_ATENDIMENTO: {
    bg: "rgba(53, 94, 197, 0.14)",
    fg: "var(--feedback-progress)"
  },
  ENCERRADO: { bg: "rgba(80, 139, 38, 0.14)", fg: "var(--feedback-done)" }
};

const labelByStatus: Record<TicketStatus, string> = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  ENCERRADO: "Encerrado"
};

export function StatusPill({ status }: Props) {
  const s = stylesByStatus[status];
  const label = labelByStatus[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {label}
    </span>
  );
}
