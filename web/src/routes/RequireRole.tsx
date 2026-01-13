import { Navigate } from "react-router-dom";
import type { Role } from "../store/auth/types";
import { useAuth } from "../store/auth/useAuth";

type Props = {
  roles: Role[];
  children: React.ReactNode;
};

export function RequireRole({ roles, children }: Props) {
  const { userRole } = useAuth();
  if (!userRole) return <Navigate to="/" replace />;
  if (!roles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
}
