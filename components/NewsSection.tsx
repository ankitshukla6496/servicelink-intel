'use client'

import { NewsArticle } from '@/lib/types'

export default function NewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="space-y-4">
      {articles.map((article, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="group">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-1">
              {article.title}
            </h3>
          </a>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{article.summary}...</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">{article.source}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-500 hover:text-blue-700 font-medium">
              Read →
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
