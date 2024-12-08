'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface AnalysisRequest {
  symbol: string
  analysisType: 'recommendations' | 'price' | 'info' | 'news'
}

interface AnalysisResponse {
  response?: string
  error?: string
}

export default function FinanceAnalysis() {
  const [symbol, setSymbol] = useState('')
  const [analysisType, setAnalysisType] = useState<AnalysisRequest['analysisType']>('recommendations')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol) {
      setError('Please enter a stock symbol')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/finance-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          analysisType
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze stock')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium mb-2">
            Stock Symbol
          </label>
          <input
            id="symbol"
            type="text" 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. NVDA"
          />
        </div>

        <div>
          <label htmlFor="analysisType" className="block text-sm font-medium mb-2">
            Analysis Type
          </label>
          <select
            id="analysisType"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as AnalysisRequest['analysisType'])}
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recommendations">Analyst Recommendations</option>
            <option value="price">Stock Price Analysis</option>
            <option value="info">Company Info</option>
            <option value="news">Latest News</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {result?.response && (
        <div className="mt-6 p-6 bg-white border rounded shadow-sm">
          <ReactMarkdown className="prose max-w-none">
            {result.response}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
} 