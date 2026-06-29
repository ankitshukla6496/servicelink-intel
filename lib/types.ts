export interface NewsArticle {
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
}

export interface CompetitorNews {
  competitor: string
  articles: NewsArticle[]
}

export interface Idea {
  title: string
  description: string
  category: 'opportunity' | 'threat' | 'strategy' | 'innovation'
}

export interface ValuationData {
  news: NewsArticle[]
  competitorMoves: CompetitorNews[]
  ideas: Idea[]
}

export interface IntelligenceData {
  news: NewsArticle[]
  competitors: CompetitorNews[]
  ideas: Idea[]
  valuations: ValuationData
  generatedAt: string
}
