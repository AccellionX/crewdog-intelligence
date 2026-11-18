# CrewDog AI – Intelligence Engine 2.0

Premium interactive SaaS demonstration for founder **Colin Rawlinson**, showcasing the next generation of CrewDog: hybrid semantic search and transferable-skills matching for oil & gas professionals.

Inspired by [crewdog.ai](https://www.crewdog.ai/).

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- shadcn-style Radix UI · Framer Motion · Lucide · Recharts

## Modules

1. **AI Search** — keyword vs hybrid semantic search, filters, citations, deduplication  
2. **CV Matching** — skill extraction, transferable fits, gaps, recommendations  
3. **Hiring Intelligence** — awards, projects, demand, company intel  
4. **Employer Discovery** — reveal employers behind agency ads  
5. **AI Intelligence** — multi-agent RAG trace (pgvector → web fallback)  
6. **Credits & Billing** — consumption, tiers, top-ups, cost analytics  

All data and metrics are **simulated** client-side. No auth, database, paid APIs, or real payments.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Deploy (Vercel)

Connect the repo to Vercel or:

```bash
npx vercel
```

No environment variables required.
