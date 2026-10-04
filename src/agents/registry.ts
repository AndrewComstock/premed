import type { AgentDefinition, AgentPlacement } from "./types";

// Register agents here. Every entry starts disabled; flip `enabled` once the agent
// exists and is reachable through the agent API. See docs/AGENTS.md and docs/DEPLOY.md.
export const agents: AgentDefinition[] = [
  {
    id: "halcyra-assistant",
    name: "Halcyra Assistant",
    description: "General site assistant: navigation, company info, FAQs.",
    provider: "bedrock",
    placements: ["global-assistant"],
    enabled: false,
  },
  {
    id: "product-finder",
    name: "Product Finder",
    description: "Recommends instruments from a description of the experiment.",
    provider: "bedrock",
    placements: ["catalog-search", "product-advisor"],
    enabled: false,
  },
  {
    id: "procurement-copilot",
    name: "Procurement Copilot",
    description: "Builds quotes and answers purchasing questions for institutions.",
    provider: "copilot-studio",
    placements: ["quote-request", "sector-advisor"],
    enabled: false,
  },
  {
    id: "service-agent",
    name: "Service Agent",
    description: "Troubleshooting, service scheduling and warranty questions.",
    provider: "custom",
    placements: ["support"],
    enabled: false,
  },
  {
    id: "clinical-product-qa",
    name: "Clinical Product Q&A",
    description:
      "Answers doctors' and nurses' questions about the instruments and assays their institution owns, from IFUs, specs and service records.",
    provider: "bedrock",
    placements: ["clinical-product-qa"],
    enabled: false,
  },
];

export function agentFor(placement: AgentPlacement): AgentDefinition | undefined {
  return agents.find((a) => a.enabled && a.placements.includes(placement));
}

export function agentsPlannedFor(placement: AgentPlacement): AgentDefinition[] {
  return agents.filter((a) => a.placements.includes(placement));
}

/** Show dashed "agent goes here" markers. Set NEXT_PUBLIC_SHOW_AGENT_SLOTS=false to hide. */
/** Base URL of the agent API (infra/agent-api), e.g. https://abc123.execute-api.us-east-1.amazonaws.com */
export const agentApiUrl = (process.env.NEXT_PUBLIC_AGENT_API_URL || "").replace(/\/$/, "");

export const showAgentSlots = process.env.NEXT_PUBLIC_SHOW_AGENT_SLOTS !== "false";
