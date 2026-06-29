import { tavily } from '@tavily/core'
import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { NewsArticle, CompetitorNews, Idea, ValuationData } from '../types'

const VALUATION_QUERIES = [
  'property valuation appraisal technology trends 2025',
  'automated valuation model AVM accuracy real estate',
  'desktop appraisal hybrid valuation mortgage lender',
  'appraisal waiver valuation modernization GSE Fannie Mae',
  'real estate valuation bias discrimination reform news',
  'valuation management software AMC platform update',
]

const COMPETITORS = [
  'Class Valuation',
  'Clear Capital',
  'Solidifi',
  'CoreLogic',
  'Reggora',
  'Nationwide Appraisal Network',
]

const ideaSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['opportunity', 'threat', 'strategy', 'innovation']),
    })
  ),
})

export async function runValuationAgent(): Promise<ValuationData> {
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY! })

  // Run valuation news + competitor valuation moves in parallel
  const [news, competitorMoves] = await Promise.all([
    fetchValuationNews(client),
    fetchCompetitorValuationMoves(client),
  ])

  const ideas = await generateValuationIdeas(news, competitorMoves)

  return { news, competitorMoves, ideas }
}

async function fetchValuationNews(client: ReturnType<typeof tavily>): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = []
  const seen = new Set<string>()

  await Promise.all(
    VALUATION_QUERIES.map(async (query) => {
      const result = await client.search(query, {
        searchDepth: 'basic',
        maxResults: 4,
        includeAnswer: false,
        days: 7,
      })
      for (const r of result.results) {
        if (!seen.has(r.url)) {
          seen.add(r.url)
          articles.push({
            title: r.title,
            summary: r.content.slice(0, 300),
            url: r.url,
            source: new URL(r.url).hostname.replace('www.', ''),
            publishedAt: r.publishedDate ?? new Date().toISOString(),
          })
        }
      }
    })
  )

  return articles.slice(0, 18)
}

async function fetchCompetitorValuationMoves(client: ReturnType<typeof tavily>): Promise<CompetitorNews[]> {
  return Promise.all(
    COMPETITORS.map(async (competitor) => {
      const result = await client.search(
        `${competitor} valuation appraisal technology product news`,
        {
          searchDepth: 'basic',
          maxResults: 3,
          includeAnswer: false,
          days: 7,
        }
      )
      const articles: NewsArticle[] = result.results.map((r) => ({
        title: r.title,
        summary: r.content.slice(0, 300),
        url: r.url,
        source: new URL(r.url).hostname.replace('www.', ''),
        publishedAt: r.publishedDate ?? new Date().toISOString(),
      }))
      return { competitor, articles }
    })
  )
}

async function generateValuationIdeas(
  news: NewsArticle[],
  competitors: CompetitorNews[]
): Promise<Idea[]> {
  const newsContext = news
    .slice(0, 10)
    .map((a) => `- ${a.title}: ${a.summary}`)
    .join('\n')

  const competitorContext = competitors
    .map(
      (c) =>
        `${c.competitor}:\n${c.articles
          .slice(0, 2)
          .map((a) => `  - ${a.title}`)
          .join('\n')}`
    )
    .join('\n\n')

  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: ideaSchema,
    prompt: `You are a strategic analyst for ServiceLink, a leading AMC. Focus exclusively on the VALUATION space.

Based on this valuation-specific intelligence, generate 8 actionable strategic ideas for ServiceLink's valuation products and services.

VALUATION NEWS:
${newsContext}

COMPETITOR VALUATION MOVES:
${competitorContext}

Generate ideas across: opportunity, threat, strategy, innovation.
Be specific to valuation technology, AVM, hybrid appraisals, and valuation modernization.`,
  })

  return object.ideas
}
