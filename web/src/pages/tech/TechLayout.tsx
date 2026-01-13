import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth/useAuth";
import { initialsFromName } from "../../utils/format";

import clipboardListIcon from "../../assets/clipboard-list.svg";
import circleUserIcon from "../../assets/circle-user.svg";
import logOutIcon from "../../assets/log-out.svg";
import logoIcon from "../../assets/Logo_IconLight.svg";

export function TechLayout() {
  const navigate = useNavigate();
  const { state, signOut } = useAuth();

  function onLogout() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#2d2f35] p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1280px] gap-4 sm:gap-6">
        <aside className="hidden w-[240px] flex-col rounded-2xl bg-[#0f1114] p-4 text-white sm:flex">
          <div className="flex items-center gap-2 px-2 py-2">
            <img src={logoIcon} alt="" className="h-7 w-7" />
            <div className="leading-tight">
              <p className="m-0 text-sm font-semibold">HelpDesk</p>
              <p className="m-0 text-[10px] tracking-widest text-white/50">
                TÉCNICO
              </p>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            <NavLink
              to="/tech/tickets"
              className={({ isActive }: { isActive: boolean }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-(--blue-dark) text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <img
                src={clipboardListIcon}
                alt=""
                className="h-4 w-4"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span>Meus chamados</span>
            </NavLink>
          </nav>

          <div className="mt-auto">
            <p className="mb-2 mt-6 px-2 text-[11px] font-semibold tracking-widest text-white/40">
              OPÇÕES
            </p>
            <div className="grid gap-1">
              <NavLink
                to="/tech/profile"
                className={({ isActive }: { isActive: boolean }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <img
                  src={circleUserIcon}
                  alt=""
                  className="h-4 w-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <span>Perfil</span>
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                <img
                  src={logOutIcon}
                  alt=""
                  className="h-4 w-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <span>Sair</span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--blue-dark) text-xs font-bold">
                {initialsFromName(state.user?.name ?? "Usuário")}
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-xs font-semibold">
                  {state.user?.name ?? "Usuário Técnico"}
                </p>
                <p className="m-0 truncate text-[11px] text-white/50">
                  {state.user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 rounded-2xl bg-white p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
