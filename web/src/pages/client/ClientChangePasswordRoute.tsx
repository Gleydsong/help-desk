import { ClientTicketsPage } from "./ClientTicketsPage";
import { ClientChangePasswordModal } from "./ClientChangePasswordModal";

export function ClientChangePasswordRoute() {
  return (
    <>
      <ClientTicketsPage />
      <ClientChangePasswordModal />
    </>
  );
}
