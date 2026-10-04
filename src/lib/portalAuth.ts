import { agentApiUrl } from "@/agents/registry";
import type { PortalSession } from "./portal";

// Customer portal sign-in, talking to the portal API in infra/agent-api
// (POST /portal/login, POST /portal/logout, GET /portal/me), which checks
// credentials against a DynamoDB users table and issues an opaque session token.
//
// Everything the UI needs from auth goes through PortalAuthProvider, so moving to
// Okta or Auth0 means writing another provider (redirect to the IdP's hosted login,
// keep its access token) and having the API verify that JWT instead.

export interface PortalAuthProvider {
  /** Returns an error message, or null when signed in. */
  signIn(email: string, password: string): Promise<string | null>;
  signOut(): Promise<void>;
  /** Loads the signed-in user's portal data, or null when there is no valid session. */
  load(): Promise<PortalSession | null>;
}

const TOKEN_KEY = "halcyra-portal-token";

export class PortalApiError extends Error {}

function readToken(): string | null {
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw) as { token: string; expiresAt: number };
    return expiresAt > Date.now() / 1000 ? token : null;
  } catch {
    return null;
  }
}

function writeToken(value: { token: string; expiresAt: number } | null) {
  try {
    if (value) window.localStorage.setItem(TOKEN_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked (private browsing): the user signs in again next visit.
  }
}

async function call(path: string, init: RequestInit = {}, token?: string | null): Promise<Response> {
  if (!agentApiUrl) {
    throw new PortalApiError("Portal sign-in isn't configured: set NEXT_PUBLIC_AGENT_API_URL to the agent API URL.");
  }
  try {
    return await fetch(`${agentApiUrl}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new PortalApiError("Can't reach the portal right now. Check your connection and try again.");
  }
}

export const tableAuth: PortalAuthProvider = {
  async signIn(email, password) {
    const res = await call("/portal/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return data.error || "Sign-in failed. Please try again.";
    writeToken({ token: data.token, expiresAt: data.expiresAt });
    return null;
  },

  async signOut() {
    const token = readToken();
    writeToken(null);
    if (token) await call("/portal/logout", { method: "POST" }, token).catch(() => undefined);
  },

  async load() {
    const token = readToken();
    if (!token) return null;
    const res = await call("/portal/me", {}, token);
    if (res.status === 401) {
      writeToken(null);
      return null;
    }
    if (!res.ok) throw new PortalApiError("The portal is unavailable right now. Please try again shortly.");
    return (await res.json()) as PortalSession;
  },
};

export const portalAuth: PortalAuthProvider = tableAuth;
