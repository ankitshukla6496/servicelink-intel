import { tavily } from '@tavily/core'
import { CompetitorNews, NewsArticle } from '../types'
import { isNotOlderThanWeek } from '../utils'

const COMPETITORS = [
  'Class Valuation',
  'Clear Capital',
  'Solidifi',
  'CoreLogic',
  'Reggora',
  'Nationwide Appraisal Network',
]

export async function runCompetitorAgent(): Promise<CompetitorNews[]> {
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY! })

  const results = await Promise.all(
    COMPETITORS.map(async (competitor) => {
      const result = await client.search(
        `${competitor} appraisal management company news`,
        {
          searchDepth: 'basic',
          maxResults: 4,
          includeAnswer: false,
          days: 7,
        }
      )

      const articles: NewsArticle[] = result.results
        .filter((r) => isNotOlderThanWeek(r.publishedDate))
        .map((r) => ({
          title: r.title,
          summary: r.content.slice(0, 300),
          url: r.url,
          source: new URL(r.url).hostname.replace('www.', ''),
          publishedAt: r.publishedDate!,
        }))

      return { competitor, articles }
    })
  )

  return results
}
