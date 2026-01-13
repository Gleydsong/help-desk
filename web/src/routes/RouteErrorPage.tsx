import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function RouteErrorPage() {
  const error = useRouteError();

  let title = "Ocorreu um erro";
  let message = "Não foi possível carregar esta página.";

  if (isRouteErrorResponse(error)) {
    title = `Erro ${error.status}`;
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#ffffff",
        color: "#111827",
        fontFamily: "var(--default-font-family, Lato, sans-serif)",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h1>
        <p style={{ margin: "10px 0 0", color: "#6b7280" }}>{message}</p>
        <p style={{ margin: "18px 0 0", fontSize: 12, color: "#9ca3af" }}>
          Se isto aconteceu após uma mudança, reinicie o dev server e atualize a
          página.
        </p>
      </div>
    </div>
  );
}
