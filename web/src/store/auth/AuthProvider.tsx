import { useCallback, useMemo, useState } from "react";
import { AuthContext, type SignInInput, type SignUpInput } from "./AuthContext";
import { clearAuthState, loadAuthState, saveAuthState } from "./authStorage";
import type { AuthState, AuthUser, Role } from "./types";
import { api } from "../../services/api";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>(() => loadAuthState());

  const isAuthenticated = Boolean(state.token && state.user);
  const userRole: Role | null = state.user?.role ?? null;

  const setAuth = useCallback((next: { token: string; user: AuthUser }) => {
    const newState: AuthState = { token: next.token, user: next.user };
    setState(newState);
    saveAuthState(newState);
  }, []);

  const signIn = useCallback(async (input: SignInInput): Promise<AuthUser> => {
    const { token, user } = await api.login(input);
    setAuth({ token, user });
    return user;
  }, [setAuth]);

  const signUp = useCallback(async (input: SignUpInput): Promise<AuthUser> => {
    await api.registerClient(input);
    const { token, user } = await api.login({
      email: input.email,
      password: input.password
    });
    setAuth({ token, user });
    return user;
  }, [setAuth]);

  const signOut = useCallback(() => {
    setState({ token: null, user: null });
    clearAuthState();
  }, []);

  const value = useMemo(
    () => ({
      state,
      isAuthenticated,
      userRole,
      signIn,
      signUp,
      signOut,
      setAuth,
    }),
    [state, isAuthenticated, userRole, signIn, signUp, signOut, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
