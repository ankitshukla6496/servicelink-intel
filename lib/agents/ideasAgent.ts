import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { NewsArticle, CompetitorNews, Idea } from '../types'

const ideaSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['opportunity', 'threat', 'strategy', 'innovation']),
    })
  ),
})

export async function runIdeasAgent(
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

  const prompt = `You are a strategic analyst for ServiceLink, a leading appraisal management company (AMC).

Based on the following industry news and competitor intelligence, generate 8 actionable strategic ideas for ServiceLink.

INDUSTRY NEWS:
${newsContext}

COMPETITOR INTELLIGENCE:
${competitorContext}

Generate ideas across these categories:
- opportunity: Market opportunities ServiceLink should pursue
- threat: Competitive threats ServiceLink should defend against
- strategy: Strategic moves to strengthen market position
- innovation: Technology or process innovations to consider

Be specific, actionable, and grounded in the news provided.`

  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: ideaSchema,
    prompt,
  })

  return object.ideas
}
