// POST /copilot/token -> { token, conversationId }
// Exchanges the Copilot Studio Direct Line secret (kept in Secrets Manager) for a
// short-lived token, so the secret never reaches the browser.
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secrets = new SecretsManagerClient({});

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export async function handler() {
  const arn = process.env.DIRECT_LINE_SECRET_ARN;
  if (!arn) return json(503, { error: "Copilot Studio is not configured." });

  const { SecretString } = await secrets.send(new GetSecretValueCommand({ SecretId: arn }));
  const res = await fetch("https://directline.botframework.com/v3/directline/tokens/generate", {
    method: "POST",
    headers: { authorization: `Bearer ${SecretString}` },
  });
  if (!res.ok) return json(502, { error: "Direct Line token request failed." });
  const { token, conversationId } = await res.json();
  return json(200, { token, conversationId });
}
