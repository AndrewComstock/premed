# Deploying the Halcyra site on AWS

```
Browser ──► AWS Amplify Hosting (static site from this repo, auto-deploys on push to main)
   │
   └──► Agent API: API Gateway HTTP API + Lambda   (infra/agent-api, AWS SAM)
            ├─ POST /chat           ──► Amazon Bedrock Agents
            ├─ POST /copilot/token  ──► Microsoft Copilot Studio (Direct Line token)
            └─ /portal/*            ──► DynamoDB (portal users, sessions, account data)
```

**Why AWS:** Bedrock agents run there, so the site, its agent backend and the agents share one
account, one IAM model and one bill. Copilot Studio and other SaaS agents are reached the same way,
through the agent API, so no secret ever ships to the browser.

## 1. Host the site with Amplify (one time, ~10 minutes)

1. AWS console → **Amplify** → **Create new app** → **GitHub** → authorize, pick
   `AndrewComstock/premed`, branch `main`.
2. Amplify reads `amplify.yml` from the repo. Accept the build settings.
   If it offers a framework choice, keep it as a static site (the build output is `out/`).
3. **Save and deploy.** The site is live at `https://main.<app-id>.amplifyapp.com`.
4. Optional: **Rewrites and redirects** → add `/<*>` → `/404.html`, type `404 (Rewrite)`,
   so unknown URLs show the site's 404 page.
5. Optional: **Custom domains** to attach your own domain.

Every push to `main` redeploys. Turn on **Previews** to get a URL per pull request.

## 2. Deploy the agent API (when the first agent is ready)

Needs the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
and credentials for the target account.

```bash
cd infra/agent-api
sam build
sam deploy --guided \
  --parameter-overrides \
    AllowedOrigin=https://main.<app-id>.amplifyapp.com \
    'BedrockAgentMap={"halcyra-assistant":{"agentId":"<AGENT_ID>","aliasId":"<ALIAS_ID>"}}'
```

The stack output `AgentApiUrl` is the API's base URL. Deploying with the defaults is harmless:
every route returns 503 "not configured" until agents are mapped.

- **Bedrock:** create the agent in the Bedrock console, publish an alias, then add it to
  `BedrockAgentMap` keyed by the site agent id from `src/agents/registry.ts`.
- **Copilot Studio:** publish the agent to a custom website/Direct Line channel, store its secret in
  Secrets Manager, and pass the secret's ARN as `CopilotDirectLineSecretArn`.
- **Other services:** add a function and route to `template.yaml` following the same pattern.

## 3. Connect the site to the agent API

1. Amplify → your app → **Environment variables** → add
   `NEXT_PUBLIC_AGENT_API_URL` = the `AgentApiUrl` output.
2. In `src/agents/registry.ts`, set `enabled: true` on the agent and merge to `main`.
3. Amplify rebuilds; the slot for that agent now talks to it.

Other useful variables: `NEXT_PUBLIC_SHOW_AGENT_SLOTS=false` hides the "coming soon" placeholders.

## 4. Customer portal

The portal's sign-in and data come from the agent API and three DynamoDB tables it creates:

| Table                     | Key         | Holds                                                         |
| ------------------------- | ----------- | ------------------------------------------------------------- |
| `halcyra-portal-users`    | `email`     | Profile, account id and a scrypt password hash (never plain)  |
| `halcyra-portal-sessions` | `tokenHash` | SHA-256 of each session token, expired after 8 hours by TTL   |
| `halcyra-portal-data`     | `pk` + `sk` | One partition per account (`ACCOUNT#<id>`) plus `PROMOTIONS`  |

1. Deploy the agent API (section 2), allowing the site's origin and local development:
   `AllowedOrigin=https://main.<app-id>.amplifyapp.com,http://localhost:3000`.
2. Load the demo data and set the demo users' password:
   ```bash
   cd infra/agent-api
   npm install
   PORTAL_DEMO_PASSWORD='<choose one>' npm run seed:portal
   ```
   Re-running replaces the demo data from `seed/portal-seed.json` and resets passwords.
3. Build the site with `NEXT_PUBLIC_AGENT_API_URL` set to the `AgentApiUrl` output and redeploy.

Demo users are the `email` values in `seed/portal-seed.json`. The users and data tables are kept if
the stack is deleted. **Moving to Okta or Auth0:** add a provider next to `tableAuth` in
`src/lib/portalAuth.ts` and make `authenticate()` in `infra/agent-api/src/portal-auth.mjs` verify the
IdP's JWT; the rest of the portal is unchanged.

## Alternatives considered

- **S3 + CloudFront:** same result with more control and no Amplify; you manage the bucket,
  distribution and a deploy job yourself.
- **Azure Static Web Apps + Azure Functions:** the natural choice if Copilot / Azure AI Foundry
  becomes the main agent platform; Bedrock would then be called cross-cloud.
- **Vercel:** simplest Next.js hosting, but agent backends would live in a separate cloud account.
