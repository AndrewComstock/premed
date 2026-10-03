// POST /chat  { agent, sessionId, message, context } -> { reply }
// Proxies one user turn to an Amazon Bedrock Agent. The AWS SDK v3 ships with the
// Lambda Node.js runtime, so no bundling is needed.
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({});
const agentMap = JSON.parse(process.env.BEDROCK_AGENT_MAP || "{}");

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export async function handler(event) {
  let req;
  try {
    req = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Body must be JSON." });
  }
  const { agent, sessionId, message, context } = req;
  if (typeof message !== "string" || !message.trim() || typeof sessionId !== "string") {
    return json(400, { error: "Expected { agent, sessionId, message }." });
  }
  if (message.length > 4000) return json(413, { error: "Message too long." });

  const target = agentMap[agent];
  if (!target) return json(503, { error: `Agent "${agent}" is not configured.` });

  let response;
  try {
    response = await client.send(
    new InvokeAgentCommand({
      agentId: target.agentId,
      agentAliasId: target.aliasId,
      sessionId: sessionId.slice(0, 100),
      inputText: message,
      // Page context (placement, product, sector) reaches the agent as session attributes.
      sessionState: { sessionAttributes: flatten(context) },
    }),
    );
  } catch (err) {
    console.error("InvokeAgent failed", err);
    return json(502, { error: "The agent is unavailable right now." });
  }

  let reply = "";
  const decoder = new TextDecoder();
  for await (const part of response.completion) {
    if (part.chunk?.bytes) reply += decoder.decode(part.chunk.bytes);
  }
  return json(200, { reply });
}

function flatten(context) {
  const out = {};
  if (context && typeof context === "object") {
    for (const [k, v] of Object.entries(context)) if (v != null) out[k] = String(v).slice(0, 200);
  }
  return out;
}
