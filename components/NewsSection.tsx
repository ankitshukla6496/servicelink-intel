'use client'

import { NewsArticle } from '@/lib/types'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 hover:border-white/20 transition-all block"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
              {article.source}
            </span>
            <span className="text-xs text-white/30 flex-shrink-0">{formatDate(article.publishedAt)}</span>
          </div>
          <h3 className="font-semibold text-white/90 group-hover:text-white text-sm leading-snug mb-2 transition-colors">
            {article.title}
          </h3>
          <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{article.summary}...</p>
          <div className="mt-3 text-xs text-blue-400/60 group-hover:text-blue-400 transition-colors font-medium">
            Read article →
          </div>
        </a>
      ))}
    </div>
  )
}
