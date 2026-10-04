# Halcyra Life Sciences (demo website)

A mock corporate website for **Halcyra Life Sciences**, a fictional life sciences equipment company
that sells to universities, government laboratories and hospitals. It exists to showcase AI agents
(AWS Bedrock, Microsoft Copilot Studio and others), which will be added later.

Everything here (company, people, products, specifications, news) is invented.

## What's inside

- Home, Products (filterable catalog), 23 product detail pages, Solutions by sector, Innovation,
  Service & Support, About, News and Contact.
- Invented catalog across 8 categories in `src/lib/products.ts`.
- A demo customer portal at `/portal` (mock sign-in, orders, inventory, deliveries, promotions and a
  placeholder for clinician product Q&A) for a hospital, a university and a government lab. Demo
  users and the password are shown on `/portal/login`; data lives in `src/lib/portal.ts`.
- Clearly marked agent slots on every key page, plus a floating "Ask Halcyra" launcher.
  See [docs/AGENTS.md](docs/AGENTS.md).

## Stack

Next.js (App Router, static export) · React · Tailwind CSS v4 · TypeScript. No backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Deploy

The site is hosted on AWS Amplify (`amplify.yml`), with an agent API for Bedrock and Copilot Studio
in `infra/agent-api`. Step-by-step instructions: [docs/DEPLOY.md](docs/DEPLOY.md).

`./out` also works on any static host (S3 + CloudFront, Azure Static Web Apps, GitHub Pages).
For a sub-path build with `NEXT_PUBLIC_BASE_PATH=/repo-name`.
