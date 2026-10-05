"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PortalSession } from "@/lib/portal";
import { portalAuth, PortalApiError, setHalcyraIQ } from "@/lib/portalAuth";

// Holds the signed-in user's portal data for every /portal page. Sign-in itself is
// done by the provider in src/lib/portalAuth.ts against the portal API.

interface PortalContextValue {
  /** False until the stored session has been checked with the API. */
  ready: boolean;
  session: PortalSession | null;
  /** Set when the API can't be reached or isn't configured. */
  error: string | null;
  /** Returns an error message, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Activates or deactivates HalcyraIQ for the account. Returns an error message, or null on success. */
  setIQ: (on: boolean) => Promise<string | null>;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<PortalSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setSession(await portalAuth.load());
      setError(null);
    } catch (e) {
      setSession(null);
      setError(e instanceof PortalApiError ? e.message : "The portal is unavailable right now.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const err = await portalAuth.signIn(email, password);
        if (err) return err;
      } catch (e) {
        return e instanceof PortalApiError ? e.message : "Sign-in failed. Please try again.";
      }
      await load();
      return null;
    },
    [load],
  );

  const signOut = useCallback(async () => {
    await portalAuth.signOut();
    setSession(null);
  }, []);

  const setIQ = useCallback(async (on: boolean) => {
    try {
      const halcyraIQ = await setHalcyraIQ(on);
      setSession((s) => (s ? { ...s, halcyraIQ } : s));
      return null;
    } catch (e) {
      return e instanceof PortalApiError ? e.message : "Couldn't update HalcyraIQ. Please try again.";
    }
  }, []);

  return (
    <PortalContext.Provider value={{ ready, session, error, signIn, signOut, setIQ }}>{children}</PortalContext.Provider>
  );
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
