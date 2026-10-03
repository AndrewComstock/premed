import { agentApiUrl } from "../registry";
import type { AgentAdapter, AgentDefinition } from "../types";

// Provider adapters. The site is a static export, so adapters call the agent API
// (infra/agent-api, deployed next to the site) rather than any cloud service
// directly. Nothing here holds secrets.

const notConnected = (provider: string): AgentAdapter => ({
  async send() {
    throw new Error(`${provider} adapter is not connected yet. See docs/AGENTS.md.`);
  },
});

/** One Bedrock session per browser tab, so the agent keeps conversation memory. */
function sessionId(): string {
  const key = "halcyra-agent-session";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function bedrock(agent: AgentDefinition): AgentAdapter {
  return {
    async send(messages, context) {
      const last = [...messages].reverse().find((m) => m.role === "user");
      const res = await fetch(`${agentApiUrl}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent: agent.id, sessionId: sessionId(), message: last?.content ?? "", context }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Agent API returned ${res.status}`);
      return { role: "assistant", content: data.reply };
    },
  };
}

/** Fetches a Direct Line token for Bot Framework WebChat (Copilot Studio). */
export async function copilotToken(): Promise<{ token: string; conversationId: string }> {
  const res = await fetch(`${agentApiUrl}/copilot/token`, { method: "POST" });
  if (!res.ok) throw new Error(`Copilot token request failed (${res.status})`);
  return res.json();
}

export function adapterFor(agent: AgentDefinition): AgentAdapter {
  if (!agentApiUrl) return notConnected("Agent API URL (NEXT_PUBLIC_AGENT_API_URL)");
  switch (agent.provider) {
    case "bedrock":
      return bedrock(agent);
    case "copilot-studio":
      // Copilot Studio renders its own WebChat UI; use copilotToken() to start it.
      return notConnected("Microsoft Copilot Studio (use copilotToken with WebChat)");
    default:
      return notConnected("Custom");
  }
}
