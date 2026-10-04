"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAccount, type CustomerAccount, type PortalUser } from "@/lib/portal";

// Mock sign-in for the static demo. The session is just the chosen demo user's id,
// kept in localStorage. Swap this for Cognito, Entra ID or another IdP when the
// portal gets a real backend.

const STORAGE_KEY = "halcyra-portal-session";

interface StoredSession {
  accountId: string;
  userId: string;
}

export interface PortalSession {
  account: CustomerAccount;
  user: PortalUser;
}

interface PortalContextValue {
  /** False until localStorage has been read on the client. */
  ready: boolean;
  session: PortalSession | null;
  signIn: (accountId: string, userId: string) => void;
  signOut: () => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

function resolve(stored: StoredSession | null): PortalSession | null {
  if (!stored) return null;
  const account = getAccount(stored.accountId);
  const user = account?.users.find((u) => u.id === stored.userId);
  return account && user ? { account, user } : null;
}

function readStored(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<PortalSession | null>(null);

  useEffect(() => {
    setSession(resolve(readStored()));
    setReady(true);
  }, []);

  const signIn = useCallback((accountId: string, userId: string) => {
    const stored = { accountId, userId };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Private browsing: the session still lasts for this page view.
    }
    setSession(resolve(stored));
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSession(null);
  }, []);

  return <PortalContext.Provider value={{ ready, session, signIn, signOut }}>{children}</PortalContext.Provider>;
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside <PortalProvider>");
  return ctx;
}

/** For pages behind sign-in; PortalShell guarantees a session before rendering them. */
export function useSession(): PortalSession {
  const { session } = usePortal();
  if (!session) throw new Error("No portal session");
  return session;
}
