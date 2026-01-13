import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../../store/auth/useAuth";
import { initialsFromName } from "../../utils/format";

import menuIcon from "../../assets/menu.svg";
import clipboardListIcon from "../../assets/clipboard-list.svg";
import usersIcon from "../../assets/users.svg";
import circleUserIcon from "../../assets/circle-user.svg";
import wrenchIcon from "../../assets/wrench.svg";
import logOutIcon from "../../assets/log-out.svg";
import logoIcon from "../../assets/Logo_IconLight.svg";

type NavItem = {
  to: string;
  label: string;
  icon: string;
};

export function AdminLayout() {
  const navigate = useNavigate();
  const { state, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      { to: "/admin/tickets", label: "Chamados", icon: clipboardListIcon },
      { to: "/admin/technicians", label: "Técnicos", icon: usersIcon },
      { to: "/admin/clients", label: "Clientes", icon: circleUserIcon },
      { to: "/admin/services", label: "Serviços", icon: wrenchIcon },
    ],
    []
  );

  function onLogout() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#2d2f35] p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1280px] gap-4 sm:gap-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1114] shadow-sm sm:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <img
            src={menuIcon}
            alt=""
            className="h-5 w-5 opacity-90"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>

        {/* Sidebar (desktop) */}
        <aside className="hidden w-[240px] flex-col rounded-2xl bg-[#0f1114] p-4 text-white sm:flex">
          <div className="flex items-center gap-2 px-2 py-2">
            <img src={logoIcon} alt="" className="h-7 w-7" />
            <div className="leading-tight">
              <p className="m-0 text-sm font-semibold">HelpDesk</p>
              <p className="m-0 text-[10px] tracking-widest text-white/50">
                ADMIN
              </p>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
                  src={item.icon}
                  alt=""
                  className="h-4 w-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--blue-dark) text-xs font-bold">
                {initialsFromName(state.user?.name ?? "Usuário")}
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-xs font-semibold">
                  {state.user?.name ?? "Usuário"}
                </p>
                <p className="m-0 truncate text-[11px] text-white/50">
                  {state.user?.email ?? ""}
                </p>
              </div>
              <button
                type="button"
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10"
                onClick={onLogout}
                aria-label="Sair"
              >
                <img
                  src={logOutIcon}
                  alt=""
                  className="h-4 w-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </button>
            </div>
          </div>
        </aside>

        {/* Sidebar (mobile drawer) */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-[#0f1114] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={logoIcon} alt="" className="h-7 w-7" />
                  <p className="m-0 text-sm font-semibold">HelpDesk</p>
                </div>
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Fechar
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
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
                      src={item.icon}
                      alt=""
                      className="h-4 w-4"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <button
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold"
                onClick={onLogout}
              >
                <img
                  src={logOutIcon}
                  alt=""
                  className="h-4 w-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                Sair
              </button>
            </div>
          </div>
        ) : null}

        {/* Main content */}
        <main className="flex-1 rounded-2xl bg-white p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
