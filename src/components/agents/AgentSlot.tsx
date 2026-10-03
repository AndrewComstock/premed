import { agentFor, agentsPlannedFor, showAgentSlots } from "@/agents/registry";
import type { AgentContext, AgentPlacement } from "@/agents/types";

/**
 * Marks a place on the page where an AI agent will be embedded.
 *
 * Today it renders a dashed placeholder naming the planned agent(s). When an
 * agent in src/agents/registry.ts is enabled for this placement, replace the
 * placeholder branch with that agent's UI (chat panel, WebChat, search box...).
 * Every slot carries data-agent-slot so it is easy to find in the DOM.
 */
export function AgentSlot({
  placement,
  title,
  prompt,
  context,
  variant = "panel",
}: {
  placement: AgentPlacement;
  title: string;
  prompt: string;
  context?: Omit<AgentContext, "placement">;
  variant?: "panel" | "inline";
}) {
  const active = agentFor(placement);
  const planned = agentsPlannedFor(placement);

  if (active) {
    // Mount point for a live agent. Rendered by the agent's own component once built.
    return (
      <div
        data-agent-slot={placement}
        data-agent-id={active.id}
        data-agent-context={JSON.stringify(context ?? {})}
      />
    );
  }

  if (!showAgentSlots) return <div data-agent-slot={placement} hidden />;

  return (
    <aside
      data-agent-slot={placement}
      className={`rounded-2xl border-2 border-dashed border-teal/50 bg-teal/5 ${variant === "inline" ? "p-5" : "p-6 md:p-8"}`}
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-plum text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
            <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-dark">AI agent slot · coming soon</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink-soft">{prompt}</p>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink-soft/70">
            <span className="flex-1 truncate">Ask a question…</span>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold">Not connected</span>
          </div>
          {planned.length > 0 && (
            <p className="mt-3 text-xs text-ink-soft">
              Planned: {planned.map((a) => `${a.name} (${providerLabel(a.provider)})`).join(", ")}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function providerLabel(p: string) {
  return p === "bedrock" ? "AWS Bedrock" : p === "copilot-studio" ? "Copilot Studio" : "custom";
}
