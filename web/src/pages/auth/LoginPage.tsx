import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBackground from "../../assets/Login_Background.png";
import logoIcon from "../../assets/Logo_IconDark.svg";
import { useAuth } from "../../store/auth/useAuth";
import type { Role } from "../../store/auth/types";

function routeForRole(role: Role): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TECH") return "/tech";
  return "/client";
}

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, state } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLoading = false;

  useEffect(() => {
    if (isAuthenticated && state.user) {
      if (state.user.role === "TECH" && state.user.mustChangePassword) {
        navigate("/tech/profile/password", { replace: true });
        return;
      }
      navigate(routeForRole(state.user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, state.user]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !isLoading;
  }, [email, password, isLoading]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await signIn({ email, password });
    } catch {
      setError("Não foi possível entrar. Verifique suas credenciais.");
    }
  }

  return (
    <main className="login-page">
      <div className="login-layout">
        <section
          className="login-hero"
          aria-hidden="true"
          style={{ backgroundImage: `url(${loginBackground})` }}
        />
        <section className="login-panel">
          <div className="login-panel-inner">
            <div className="login-brand">
              <img src={logoIcon} alt="" />
              <span>HelpDesk</span>
            </div>

            <div className="login-card">
              <div>
                <h1 className="login-title">Acesse o portal</h1>
                <p className="login-subtitle">
                  Entre usando seu e-mail e senha cadastrados
                </p>
              </div>

              <form className="login-form" onSubmit={onSubmit}>
                <div className="login-field">
                  <label htmlFor="email">E-MAIL</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@mail.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="login-field">
                  <label htmlFor="password">SENHA</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className="login-button"
                  type="submit"
                  disabled={!canSubmit}
                >
                  Entrar
                </button>
                {error ? (
                  <p style={{ margin: 0, color: "var(--feedback-danger)" }}>
                    {error}
                  </p>
                ) : null}
              </form>
            </div>

            <div className="login-register">
              <div>
                <p className="login-register-title">Ainda não tem uma conta?</p>
                <p className="login-register-subtitle">Cadastre agora mesmo</p>
              </div>
              <button
                className="login-secondary"
                type="button"
                onClick={() => navigate("/register")}
              >
                Criar conta
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
