# Halcyra Life Sciences (demo website)

A mock corporate website for **Halcyra Life Sciences**, a fictional life sciences equipment company
that sells to universities, government laboratories and hospitals. It exists to showcase AI agents
(AWS Bedrock, Microsoft Copilot Studio and others), which will be added later.

Everything here (company, people, products, specifications, news) is invented.

## What's inside

- Home, Products (filterable catalog), 23 product detail pages, Solutions by sector, Innovation,
  Service & Support, About, News and Contact.
- Invented catalog across 8 categories in `src/lib/products.ts`.
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

`./out` can be hosted on S3 + CloudFront, Azure Static Web Apps, GitHub Pages or any static host.
For a sub-path (e.g. GitHub Pages project sites) build with `NEXT_PUBLIC_BASE_PATH=/repo-name`.
