// Agent integration contract. No agents are implemented yet; this defines the
// seams where AWS Bedrock, Microsoft Copilot Studio or other agents plug in.

/** Named places on the site where an agent can be mounted. */
export type AgentPlacement =
  | "global-assistant" // floating launcher, present on every page
  | "catalog-search" // natural-language product finder on /products
  | "product-advisor" // Q&A about a single product on /products/[slug]
  | "quote-request" // procurement / RFQ helper on /contact and product pages
  | "sector-advisor" // sector-specific guidance on /solutions
  | "support" // service & support assistant on /support
  | "clinical-product-qa"; // product Q&A for clinicians in the customer portal (/portal/ask)

export type AgentProvider = "bedrock" | "copilot-studio" | "custom";

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  provider: AgentProvider;
  placements: AgentPlacement[];
  enabled: boolean;
  /** Optional provider-specific settings. Bedrock agent IDs live server-side in the agent API. */
  config?: Record<string, string>;
}

/** Context the page hands to an agent when it is mounted. */
export interface AgentContext {
  placement: AgentPlacement;
  page: string;
  productSlug?: string;
  sector?: string;
  /** Customer portal only: the signed-in account and user, and the instruments they own. */
  accountId?: string;
  userRole?: string;
  installedProducts?: string[];
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

/** What every provider adapter implements. */
export interface AgentAdapter {
  send(messages: AgentMessage[], context: AgentContext): Promise<AgentMessage>;
}
