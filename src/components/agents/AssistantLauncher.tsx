"use client";

import { useState } from "react";
import { agentFor, showAgentSlots } from "@/agents/registry";

/**
 * Floating site-wide assistant button (placement "global-assistant").
 * Opens a panel that a Bedrock, Copilot Studio or custom agent will render into.
 */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const agent = agentFor("global-assistant");
  if (!agent && !showAgentSlots) return null;

  return (
    <div data-agent-slot="global-assistant" className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Halcyra Assistant"
          className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-ink/20"
        >
          <div className="hero-gradient flex items-center justify-between px-5 py-4 text-white">
            <div>
              <p className="font-bold">Halcyra Assistant</p>
              <p className="text-xs text-white/70">{agent ? "Online" : "Agent not connected yet"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded p-1 hover:bg-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div id="agent-root-global" className="space-y-3 p-5 text-sm text-ink-soft">
            <p className="rounded-xl bg-mist p-3">
              Hi! I&apos;ll soon be able to help you find instruments, compare specifications, request quotes and
              book service.
            </p>
            <p className="text-xs">
              This panel is the mount point for the site-wide agent. Register one in{" "}
              <code className="rounded bg-mist px-1">src/agents/registry.ts</code>.
            </p>
          </div>
          <div className="border-t border-line p-3">
            <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft/60">
              <span className="flex-1">Type a message…</span>
              <span aria-hidden>➤</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-plum px-5 py-3.5 font-semibold text-white shadow-lg shadow-plum/30 transition hover:bg-plum-dark"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
        </svg>
        Ask Halcyra
      </button>
    </div>
  );
}
