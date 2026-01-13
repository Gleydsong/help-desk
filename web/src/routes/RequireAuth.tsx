import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth/useAuth";

type Props = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: Props) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
