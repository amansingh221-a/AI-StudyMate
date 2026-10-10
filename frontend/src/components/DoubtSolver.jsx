import React, { useState } from 'react'
import { askDoubt } from '../api.js'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import { Spinner, ErrorBox, PageHeader, EmptyState } from './UIComponents.jsx'

const EXAMPLE_QUESTIONS = [
  "Explain how binary search works with an example.",
  "What is the difference between RAM and ROM?",
  "How does Newton's third law of motion work?",
  "What is photosynthesis and why is it important?",
  "Explain time complexity with Big O notation.",
]

export default function DoubtSolver() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const handleAsk = async (e) => {
    e.preventDefault()
    const q = question.trim()
    if (!q) {
      setError('Please enter a question.')
      return
    }
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const data = await askDoubt(q)
      setAnswer(data.answer)
      setHistory(prev => [{ question: q, answer: data.answer, time: new Date() }, ...prev.slice(0, 4)])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExample = (ex) => {
    setQuestion(ex)
    setAnswer('')
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="💡"
        title="Doubt Solver"
        subtitle="Ask any academic question and get a clear, step-by-step explanation."
      />

      {/* Example questions */}
      <div className="mb-6">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExample(ex)}
              className="text-xs px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-full text-slate-300 hover:text-blue-300 hover:border-blue-500/50 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Question form */}
      <div className="glass-card p-6 mb-6">
        <form onSubmit={handleAsk} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Question <span className="text-red-400">*</span>
            </label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Type your question here... (e.g. Explain recursion with a simple example)"
              className="input-field resize-none"
              rows={4}
              disabled={loading}
              maxLength={1000}
            />
            <p className="text-xs text-slate-500 mt-1 text-right">{question.length}/1000</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Getting answer...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Ask Question
                </>
              )}
            </button>
            {answer && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setAnswer(''); setQuestion(''); setError('') }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {loading && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl fade-in">
            <Spinner />
            <div>
              <p className="text-purple-300 font-medium">Thinking through your question...</p>
              <p className="text-purple-400/70 text-sm">AI is preparing a step-by-step explanation.</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div className="mb-4"><ErrorBox message={error} /></div>}

      {/* Answer */}
      {answer && (
        <div className="glass-card p-6 mb-6 fade-in border-purple-500/20">
          <div className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-700/50">
            <div className="w-8 h-8 bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
              💡
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Your question:</p>
              <p className="text-slate-200 font-medium mt-0.5">{history[0]?.question}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600/30 border border-blue-500/30 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-1">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium mb-3">AI Answer:</p>
              <MarkdownRenderer content={answer} />
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!answer && !loading && !error && (
        <EmptyState
          icon="❓"
          title="No question asked yet"
          description="Type your academic doubt above or click one of the example questions to get started."
        />
      )}
    </div>
  )
}

