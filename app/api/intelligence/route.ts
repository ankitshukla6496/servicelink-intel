import { NextResponse } from 'next/server'
import { runNewsAgent } from '@/lib/agents/newsAgent'
import { runCompetitorAgent } from '@/lib/agents/competitorAgent'
import { runIdeasAgent } from '@/lib/agents/ideasAgent'
import { runValuationAgent } from '@/lib/agents/valuationAgent'
import { IntelligenceData } from '@/lib/types'

export const maxDuration = 120

export async function GET() {
  try {
    // Run all agents in parallel
    const [news, competitors, valuations] = await Promise.all([
      runNewsAgent(),
      runCompetitorAgent(),
      runValuationAgent(),
    ])

    // Ideas agent consumes general news + competitor output
    const ideas = await runIdeasAgent(news, competitors)

    const data: IntelligenceData = {
      news,
      competitors,
      ideas,
      valuations,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Intelligence pipeline error:', error)
    return NextResponse.json(
      { error: 'Failed to run intelligence pipeline' },
      { status: 500 }
    )
  }
}
