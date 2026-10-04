# Plugging agents into the Halcyra site

The site ships with **no agents**. It has named *placements* where agents will be mounted, a registry
that says which agent goes where, and stub provider adapters for AWS Bedrock and Microsoft Copilot Studio.

## Placements

| Placement          | Where it appears                                   | Planned agent (see registry)        |
| ------------------ | -------------------------------------------------- | ----------------------------------- |
| `global-assistant` | Floating "Ask Halcyra" button on every page        | Halcyra Assistant (Bedrock)         |
| `catalog-search`   | Home page portfolio section, top of `/products`    | Product Finder (Bedrock)            |
| `product-advisor`  | Each product page, under the spec table            | Product Finder (Bedrock)            |
| `quote-request`    | Product page sidebar, `/contact` sidebar           | Procurement Copilot (Copilot Studio)|
| `sector-advisor`   | Each sector section on `/solutions`                | Procurement Copilot (Copilot Studio)|
| `support`          | Top of `/support`                                  | Service Agent (custom)              |
| `clinical-product-qa` | Customer portal, `/portal/ask`                  | Clinical Product Q&A (Bedrock)      |

Every slot renders an element with `data-agent-slot="<placement>"`, plus the page context
(`page`, `productSlug`, `sector`) the agent should receive. Portal slots also pass `accountId`, `userRole`
and `installedProducts` (catalog slugs of the instruments on the signed-in account).

## Customer portal

`/portal` is a demo customer portal (orders, inventory, deliveries, promotions) for three invented
institutions: a hospital, a university and a government lab. Sign-in is a client-side mock with demo
users listed on `/portal/login`; all sample data lives in `src/lib/portal.ts`, with instruments keyed
to catalog slugs so an agent can join account data with `src/lib/products.ts`. The clinician product
Q&A feature at `/portal/ask` is intentionally unimplemented: it is the `clinical-product-qa` slot.

## Files

- `src/agents/types.ts`: the contract (`AgentDefinition`, `AgentContext`, `AgentAdapter`).
- `src/agents/registry.ts`: the list of agents; all start with `enabled: false`.
- `src/agents/providers/index.ts`: provider adapters (stubs today).
- `src/components/agents/AgentSlot.tsx`: inline/panel slot used on pages.
- `src/components/agents/AssistantLauncher.tsx`: the floating site-wide assistant.

## Adding an agent

1. Fill in the agent's entry in `src/agents/registry.ts` (or add one) and set `enabled: true`.
2. Implement its provider in `src/agents/providers/index.ts`.
3. Replace the "active" branch of `AgentSlot` (and the panel body of `AssistantLauncher`) with the
   agent's UI: a chat component that calls `adapterFor(agent).send(messages, context)`, or an
   embedded widget.

### AWS Bedrock Agents

The site is a static export, so the browser cannot hold AWS credentials. It calls the agent API in
`infra/agent-api` (API Gateway + Lambda), whose `POST /chat` route invokes the Bedrock agent mapped
to the site agent id. The Bedrock adapter in `src/agents/providers/index.ts` already speaks to it;
set `NEXT_PUBLIC_AGENT_API_URL` and map the agent (see [DEPLOY.md](DEPLOY.md)). The product catalog in
`src/lib/products.ts` is a good knowledge-base source (export it to JSON/S3).

### Microsoft Copilot Studio

Publish the agent to a custom website / Direct Line channel. Either embed its iframe in the slot, or
call `copilotToken()` (which hits the agent API's `POST /copilot/token`) and render Bot Framework
WebChat with the returned token.

### Hiding the placeholders

Build with `NEXT_PUBLIC_SHOW_AGENT_SLOTS=false` to hide the dashed "coming soon" markers for a
clean, agent-free version of the site.
