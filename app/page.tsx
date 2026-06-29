'use client'

import { useState, useEffect } from 'react'
import NewsSection from '@/components/NewsSection'
import CompetitorSection from '@/components/CompetitorSection'
import IdeasSection from '@/components/IdeasSection'
import ValuationsSection from '@/components/ValuationsSection'
import AgentPipeline from '@/components/AgentPipeline'
import { IntelligenceData } from '@/lib/types'

type Tab = 'news' | 'competitors' | 'ideas' | 'valuations'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('news')
  const [data, setData] = useState<IntelligenceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem('sl-intel-data')
    const cachedTime = localStorage.getItem('sl-intel-time')
    if (cached) {
      setData(JSON.parse(cached))
      setLastRefreshed(cachedTime ?? null)
    }
  }, [])

  const TABS: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'news', label: 'Industry News', icon: '📰', count: data?.news.length },
    { id: 'competitors', label: 'Competitor Intel', icon: '🔭', count: data?.competitors.length },
    { id: 'ideas', label: 'Strategic Ideas', icon: '💡', count: data?.ideas.length },
    { id: 'valuations', label: 'Valuations', icon: '🏡', count: data?.valuations.news.length },
  ]

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/intelligence')
      if (!res.ok) throw new Error('Failed to fetch intelligence data')
      const json: IntelligenceData = await res.json()
      const timeStr = new Date().toLocaleTimeString()
      setData(json)
      setLastRefreshed(timeStr)
      localStorage.setItem('sl-intel-data', JSON.stringify(json))
      localStorage.setItem('sl-intel-time', timeStr)
    } catch {
      setError('Something went wrong. Check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm tracking-tight">SL</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-none">ServiceLink Intelligence Portal</h1>
              <p className="text-xs text-white/40 mt-0.5">AMC &amp; Appraisal Industry · Last 7 days</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/30">Ankit Shukla</p>
              {lastRefreshed && (
                <p className="text-xs text-white/20">Updated {lastRefreshed}</p>
              )}
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running agents...
                </>
              ) : (
                <> Refresh Intelligence</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats bar — only when data loaded */}
        {data && !loading && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Industry Articles', value: data.news.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { label: 'Competitors Tracked', value: data.competitors.length, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
              { label: 'Strategic Ideas', value: data.ideas.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Valuation Articles', value: data.valuations.news.length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            ].map((stat) => (
              <div key={stat.label} className={`border rounded-xl p-4 ${stat.bg}`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Ready to gather intelligence</h2>
            <p className="text-white/40 mb-8 max-w-sm text-sm leading-relaxed">
              3 agents will run in parallel — scanning AMC industry news, monitoring 6 competitors, and generating strategic ideas for ServiceLink.
            </p>
            <div className="flex gap-3 mb-8 text-xs text-white/30">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>News Agent</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>Competitor Agent</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Ideas Agent</span>
            </div>
            <button
              onClick={refresh}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
              Run Intelligence Pipeline
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && <AgentPipeline />}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Tabs + content */}
        {data && !loading && (
          <>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6 w-fit border border-white/10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/30'
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
            {activeTab === 'valuations' && <ValuationsSection data={data.valuations} />}
          </>
        )}
      </main>

      <footer className="border-t border-white/5 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-white/20">
          <span>ServiceLink Intelligence Portal</span>
          <span>Ankit Shukla · Powered by Claude</span>
        </div>
      </footer>
    </div>
  )
}
