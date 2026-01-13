import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBackground from "../../assets/Login_Background.png";
import logoIcon from "../../assets/Logo_IconDark.svg";
import { useAuth } from "../../store/auth/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLoading = false;

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      !isLoading
    );
  }, [name, email, password, confirmPassword, isLoading]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas nÇœo conferem.");
      return;
    }

    try {
      await signUp({ name, email, password });
      navigate("/client", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "Email already in use") {
        setError("Este e-mail jÇ­ estÇ­ cadastrado. FaÇõa login.");
        return;
      }
      setError("NÇœo foi possÇðvel realizar o cadastro. Tente novamente.");
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
                <h1 className="login-title">Criar conta</h1>
                <p className="login-subtitle">
                  Cadastre seus dados para acessar
                </p>
              </div>

              <form className="login-form" onSubmit={onSubmit}>
                <div className="login-field">
                  <label htmlFor="name">NOME</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

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
                    placeholder="Crie uma senha"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="confirmPassword">CONFIRMAR SENHA</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={!canSubmit}
                >
                  Cadastrar
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
                <p className="login-register-title">Já possui uma conta?</p>
                <p className="login-register-subtitle">Entre agora mesmo</p>
              </div>
              <button
                className="login-secondary"
                type="button"
                onClick={() => navigate("/", { replace: true })}
              >
                Acessar conta
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
