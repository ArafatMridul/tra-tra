import { createContext, useCallback, useMemo, useState } from "react";
import { AuthContextType, AuthUser } from "../types";
import { authApi } from "../api/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const setAuthUser = useCallback((next: AuthUser | null) => {
    setUser(next);
  }, []);

  const initialize = useCallback(async () => {
    try {
      const current = await authApi.me();
      setAuthUser(current);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authenticated = await authApi.login(email, password);
    setAuthUser(authenticated);
    return authenticated;
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const created = await authApi.register(fullName, email, password);
    setAuthUser(created);
    return created;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAuthUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: setAuthUser,
      loading,
      initialize,
      login,
      register,
      logout,
    }),
    [user, loading, initialize, login, register, logout, setAuthUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
