import { tavily } from '@tavily/core'
import { NewsArticle } from '../types'
import { isWithinLastWeek } from '../utils'

const DOMAIN_QUERIES = [
  'appraisal management company AMC industry news 2025',
  'real estate appraisal valuation trends 2025',
  'homebuyer mortgage appraisal gap waiver news',
  'property valuation technology appraisal software',
  'USPAP appraisal regulation compliance news',
]

export async function runNewsAgent(): Promise<NewsArticle[]> {
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY! })
  const articles: NewsArticle[] = []
  const seen = new Set<string>()

  await Promise.all(
    DOMAIN_QUERIES.map(async (query) => {
      const result = await client.search(query, {
        searchDepth: 'basic',
        maxResults: 5,
        includeAnswer: false,
        days: 7,
      })

      for (const r of result.results) {
        if (!seen.has(r.url) && isWithinLastWeek(r.publishedDate)) {
          seen.add(r.url)
          articles.push({
            title: r.title,
            summary: r.content.slice(0, 300),
            url: r.url,
            source: new URL(r.url).hostname.replace('www.', ''),
            publishedAt: r.publishedDate!,
          })
        }
      }
    })
  )

  return articles.slice(0, 20)
}
