import React from 'react'
import FinanceAnalysis from '@/finance-agent-app/src/app/components/finance-analysis'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finance Agent Analysis</h1>
        <FinanceAnalysis />
      </div>
    </main>
  )
} 