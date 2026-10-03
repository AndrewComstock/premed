import type { AgentDefinition, AgentPlacement } from "./types";

// Register agents here. Every entry starts disabled; flip `enabled` and fill in
// `config` once the agent exists. See docs/AGENTS.md for the walkthrough.
export const agents: AgentDefinition[] = [
  {
    id: "halcyra-assistant",
    name: "Halcyra Assistant",
    description: "General site assistant: navigation, company info, FAQs.",
    provider: "bedrock",
    placements: ["global-assistant"],
    enabled: false,
    config: { agentId: "", agentAliasId: "", endpoint: "" },
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
    config: { directLineTokenEndpoint: "" },
  },
  {
    id: "service-agent",
    name: "Service Agent",
    description: "Troubleshooting, service scheduling and warranty questions.",
    provider: "custom",
    placements: ["support"],
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
export const showAgentSlots = process.env.NEXT_PUBLIC_SHOW_AGENT_SLOTS !== "false";
