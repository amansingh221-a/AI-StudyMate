import React, { useState } from 'react'
import { generateNotes } from '../api.js'
import MarkdownRenderer from './MarkdownRenderer.jsx'
import { Spinner, ErrorBox, SuccessToast, PageHeader, EmptyState } from './UIComponents.jsx'

export default function NotesGenerator() {
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError('Please enter a topic to generate notes.')
      return
    }
    setLoading(true)
    setError('')
    setNotes('')
    setToast('')
    try {
      const data = await generateNotes(topic, subject)
      setNotes(data.notes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(notes).then(() => {
      setToast('Notes copied to clipboard!')
      setTimeout(() => setToast(''), 3000)
    })
  }

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic.replace(/\s+/g, '_')}_notes.txt`
    a.click()
    URL.revokeObjectURL(url)
    setToast('Notes downloaded!')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="📝"
        title="Notes Generator"
        subtitle="Enter any topic and get comprehensive, well-structured study notes powered by AI."
      />

      {/* Input form */}
      <div className="glass-card p-6 mb-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Newton's Laws of Motion, Binary Search Trees, Photosynthesis..."
              className="input-field"
              disabled={loading}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subject <span className="text-slate-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Physics, Computer Science, Biology..."
              className="input-field"
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Generating notes...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Notes
                </>
              )}
            </button>
            {notes && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setNotes(''); setTopic(''); setSubject(''); setError('') }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl fade-in">
            <Spinner />
            <div>
              <p className="text-blue-300 font-medium">Generating your notes...</p>
              <p className="text-blue-400/70 text-sm">This may take 10-20 seconds. Please wait.</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div className="mb-4"><ErrorBox message={error} /></div>}

      {/* Success toast */}
      {toast && (
        <div className="mb-4">
          <SuccessToast message={toast} onClose={() => setToast('')} />
        </div>
      )}

      {/* Notes output */}
      {notes && (
        <div className="glass-card p-6 fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700/50">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Generated Notes</h2>
              <p className="text-sm text-slate-400">Topic: {topic}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                📋 Copy
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                ⬇️ Download TXT
              </button>
            </div>
          </div>
          <MarkdownRenderer content={notes} />
        </div>
      )}

      {/* Empty state */}
      {!notes && !loading && !error && (
        <EmptyState
          icon="📖"
          title="No notes yet"
          description="Enter a topic above and click 'Generate Notes' to create comprehensive study notes."
        />
      )}
    </div>
  )
}

