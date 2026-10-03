import type { AgentAdapter, AgentDefinition } from "../types";

// Provider adapters. The site is a static export, so adapters call an HTTPS
// endpoint you host (API Gateway + Lambda for Bedrock, Direct Line for Copilot
// Studio). Nothing here holds secrets. Implement these when the agents exist.

const notConnected = (provider: string): AgentAdapter => ({
  async send() {
    throw new Error(`${provider} adapter is not connected yet. See docs/AGENTS.md.`);
  },
});

export function adapterFor(agent: AgentDefinition): AgentAdapter {
  switch (agent.provider) {
    case "bedrock":
      // TODO: POST { messages, context } to agent.config.endpoint, which proxies
      // bedrock-agent-runtime InvokeAgent(agentId, agentAliasId).
      return notConnected("AWS Bedrock");
    case "copilot-studio":
      // TODO: fetch a Direct Line token from agent.config.directLineTokenEndpoint
      // and render WebChat, or post activities directly.
      return notConnected("Microsoft Copilot Studio");
    default:
      return notConnected("Custom");
  }
}
