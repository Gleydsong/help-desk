import { createContext } from "react";
import type { AuthState, AuthUser, Role } from "./types";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthContextValue = {
  state: AuthState;
  isAuthenticated: boolean;
  userRole: Role | null;
  signIn(input: SignInInput): Promise<AuthUser>;
  signUp(input: SignUpInput): Promise<AuthUser>;
  signOut(): void;
  setAuth(next: { token: string; user: AuthUser }): void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
