"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchMe, logoutApi, type AuthUser } from "../../lib/authApi";
import LoginModal from "./LoginModal";

interface LoginRequest {
  message?: string;
  onSuccess?: () => void;
}

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  openLogin: (req?: LoginRequest) => void;
  requireLogin: (message: string, action: () => void) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [request, setRequest] = useState<LoginRequest | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((u) => !cancelled && setUser(u))
      .finally(() => !cancelled && setIsReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const openLogin = useCallback((req: LoginRequest = {}) => setRequest(req), []);

  const requireLogin = useCallback(
    (message: string, action: () => void) => {
      if (!isReady) return;
      if (user) return action();
      setRequest({ message, onSuccess: action });
    },
    [user, isReady]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isReady, openLogin, requireLogin, setUser, logout }),
    [user, isReady, openLogin, requireLogin, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {request && (
        <LoginModal
          message={request.message}
          onClose={() => setRequest(null)}
          onVerified={(u) => {
            const next = request.onSuccess;
            setUser(u);
            setRequest(null);
            next?.();
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() must be used inside <AuthProvider> (add it in app/layout.tsx).");
  return ctx;
}