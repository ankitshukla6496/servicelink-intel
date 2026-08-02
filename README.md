# ServiceLink Intelligence Portal

A multi-agent competitive-intelligence pipeline for the **Appraisal Management Company (AMC)** and property-valuation industry. Four autonomous agents scan the last 7 days of the web, monitor named competitors, and use an LLM to synthesize the raw signal into categorized, actionable strategy — surfaced through a real-time dashboard and refreshed nightly via cron.

Built on Next.js 16 (App Router, React 19), the [Vercel AI SDK](https://sdk.vercel.ai), [Tavily](https://tavily.com) search, and Anthropic Claude.

---

## Architecture

The system is a fan-out / fan-in agent pipeline. A single API route orchestrates four agents; three run fully in parallel, and a fourth consumes their output to reason over the combined context.

```
                         GET /api/intelligence
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        ┌──────────┐       ┌────────────┐      ┌────────────┐
        │  News    │       │ Competitor │      │ Valuation  │
        │  Agent   │       │   Agent    │      │   Agent    │
        └────┬─────┘       └─────┬──────┘      └─────┬──────┘
             │                   │                   │
        Tavily search       Tavily search      Tavily × N +
        (5 queries)         (6 competitors)    Claude synthesis
             │                   │                   │
             └─────────┬─────────┘                   │
                       ▼                             │
                 ┌───────────┐                       │
                 │  Ideas    │                       │
                 │  Agent    │  ◄── news + competitors
                 │ (Claude)  │                       │
                 └─────┬─────┘                       │
                       │                             │
                       └──────────────┬──────────────┘
                                      ▼
                            IntelligenceData (JSON)
```

| Agent | Source | Model | Responsibility |
|-------|--------|-------|----------------|
| **News** | Tavily | — | Broad AMC / appraisal industry news across 5 domain queries |
| **Competitor** | Tavily | — | Per-competitor news for 6 named AMCs |
| **Valuation** | Tavily + Claude | `claude-sonnet-4-6` | Valuation-specific news + competitor moves, then LLM-generated valuation ideas |
| **Ideas** | Claude | `claude-sonnet-4-6` | Synthesizes news + competitor context into 8 strategic ideas |

The News, Competitor, and Valuation agents dispatch with `Promise.all`; the Ideas agent runs last because it depends on their results. Each search agent itself fans out its queries concurrently.

### Data model

All agents converge on a single typed payload ([`lib/types.ts`](lib/types.ts)):

```ts
interface IntelligenceData {
  news: NewsArticle[]
  competitors: CompetitorNews[]
  ideas: Idea[]
  valuations: ValuationData
  generatedAt: string
}

interface Idea {
  title: string
  description: string
  category: 'opportunity' | 'threat' | 'strategy' | 'innovation'
}
```

### Structured LLM output

Strategic ideas are not free-form text. The Ideas and Valuation agents use `generateObject` from the AI SDK with a [Zod](https://zod.dev) schema, so Claude returns validated, typed objects the UI can render directly — every idea is guaranteed to carry a `title`, `description`, and one of four `category` enums.

```ts
const { object } = await generateObject({
  model: anthropic('claude-sonnet-4-6'),
  schema: ideaSchema,
  prompt,
})
```

### Freshness filtering

Search results are constrained to a rolling 7-day window at two layers: Tavily is queried with `days: 7`, and every result is re-checked in-process by [`isNotOlderThanWeek`](lib/utils.ts). The filter is deliberately lenient — an article with a missing or unparseable date is *included* rather than dropped, since absence of a date is not evidence of staleness. URLs are de-duplicated across queries via a `Set`.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| AI orchestration | Vercel AI SDK 7 (`ai`, `@ai-sdk/anthropic`) |
| LLM | Anthropic Claude (`claude-sonnet-4-6`) |
| Web search | Tavily (`@tavily/core`) |
| Schema / validation | Zod 4 |
| Language | TypeScript 5 |
| Hosting | Vercel (Functions + Cron) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Tavily API key](https://tavily.com)
- An [Anthropic API key](https://console.anthropic.com)

### Setup

```bash
git clone https://github.com/ankitshukla6496/servicelink-intel.git
cd servicelink-intel
npm install
```

Create a `.env.local` file:

```bash
TAVILY_API_KEY=tvly-...
ANTHROPIC_API_KEY=sk-ant-...
```

> The Anthropic key is read automatically by `@ai-sdk/anthropic`; the Tavily key is passed explicitly into each search agent.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Run Intelligence Pipeline**. The first run can take up to ~2 minutes as the agents fan out across dozens of searches and two LLM calls.

---

## API

### `GET /api/intelligence`

Runs the full pipeline and returns the complete `IntelligenceData` payload. Configured with `maxDuration = 120` to accommodate the parallel search + synthesis workload.

```bash
curl http://localhost:3000/api/intelligence
```

Returns `200` with the JSON payload, or `500` with `{ "error": "Failed to run intelligence pipeline" }` on failure.

---

## Scheduled Runs

The pipeline is wired to a Vercel Cron job ([`vercel.json`](vercel.json)) that hits the endpoint every morning at **07:00 UTC**:

```json
{
  "crons": [{ "path": "/api/intelligence", "schedule": "0 7 * * *" }]
}
```

---

## Frontend

A single-page dashboard ([`app/page.tsx`](app/page.tsx)) with two top-level views — **Mortgage Industry** and **Valuations** — each split into *News*, *Competitor Intel*, and *Strategic Ideas* tabs. Results are cached in `localStorage` so the last run persists across reloads, and an animated agent-pipeline view renders while a refresh is in flight.

---

## Configuration

Agent behavior is driven by plain string arrays at the top of each agent file — edit these to retarget the system:

- **Tracked competitors** — `COMPETITORS` in [`competitorAgent.ts`](lib/agents/competitorAgent.ts) and [`valuationAgent.ts`](lib/agents/valuationAgent.ts)
- **Industry search queries** — `DOMAIN_QUERIES` in [`newsAgent.ts`](lib/agents/newsAgent.ts)
- **Valuation search queries** — `VALUATION_QUERIES` in [`valuationAgent.ts`](lib/agents/valuationAgent.ts)
- **Freshness window** — `SEVEN_DAYS_MS` in [`lib/utils.ts`](lib/utils.ts)

---

## Project Structure

```
app/
  api/intelligence/route.ts   # Pipeline orchestrator (fan-out/fan-in)
  page.tsx                    # Dashboard UI
  layout.tsx                  # Root layout, fonts, metadata
components/                   # NewsSection, CompetitorSection, IdeasSection,
                              # ValuationsSection, AgentPipeline
lib/
  agents/
    newsAgent.ts              # Industry news (Tavily)
    competitorAgent.ts        # Per-competitor news (Tavily)
    valuationAgent.ts         # Valuation news + moves + ideas (Tavily + Claude)
    ideasAgent.ts             # Strategic idea synthesis (Claude)
  types.ts                    # Shared domain types
  utils.ts                    # Freshness filtering
vercel.json                   # Cron schedule
```

---

## Deploy

Deploy on [Vercel](https://vercel.com/new). Set `TAVILY_API_KEY` and `ANTHROPIC_API_KEY` in the project's environment variables — the cron job runs automatically once deployed.
