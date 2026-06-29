'use client'

import { useState } from 'react'
import NewsSection from '@/components/NewsSection'
import CompetitorSection from '@/components/CompetitorSection'
import IdeasSection from '@/components/IdeasSection'
import { IntelligenceData } from '@/lib/types'

type Tab = 'news' | 'competitors' | 'ideas'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('news')
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'news', label: 'Industry News', count: data?.news.length },
    { id: 'competitors', label: 'Competitor Intel', count: data?.competitors.length },
    { id: 'ideas', label: 'Strategic Ideas', count: data?.ideas.length },
  ]

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/intelligence')
      if (!res.ok) throw new Error('Failed to fetch intelligence data')
      const json: IntelligenceData = await res.json()
      setData(json)
      setLastRefreshed(new Date().toLocaleTimeString())
    } catch (e) {
      setError('Something went wrong. Check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ServiceLink Intelligence Portal</h1>
              <p className="text-xs text-gray-500">AMC &amp; Appraisal Industry Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastRefreshed && (
              <span className="text-xs text-gray-400">Last refreshed: {lastRefreshed}</span>
            )}
            <button
              onClick={refresh}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running agents...
                </>
              ) : (
                <>&#8635; Refresh Intelligence</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Empty state */}
        {!data && !loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">&#128269;</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to gather intelligence</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Click &quot;Refresh Intelligence&quot; to run all three agents — News, Competitor Intel, and Ideas — in parallel.
            </p>
            <button
              onClick={refresh}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Run Intelligence Pipeline
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-3xl">&#9889;</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Agents are running...</h2>
            <div className="space-y-2 text-sm text-gray-500 max-w-xs mx-auto">
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                News Agent — scanning AMC industry
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                Competitor Agent — monitoring rivals
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                Ideas Agent — generating insights
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Data */}
        {data && !loading && (
          <>
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg mb-6 w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'news' && <NewsSection articles={data.news} />}
            {activeTab === 'competitors' && <CompetitorSection competitors={data.competitors} />}
            {activeTab === 'ideas' && <IdeasSection ideas={data.ideas} />}
          </>
        )}
      </main>
    </div>
  )
}
