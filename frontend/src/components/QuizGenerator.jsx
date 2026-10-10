import React, { useState } from 'react'
import { generateQuiz } from '../api.js'
import { Spinner, ErrorBox, SuccessToast, PageHeader, EmptyState } from './UIComponents.jsx'

export default function QuizGenerator() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [error, setError] = useState('')

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [toast, setToast] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz.')
      return
    }
    setLoading(true)
    setError('')
    setQuiz(null)
    setUserAnswers({})
    setSubmitted(false)
    setScore(null)
    setToast('')

    try {
      const data = await generateQuiz(topic, difficulty, numQuestions)
      setQuiz(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (questionId, optionIndex) => {
    if (submitted) return
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = () => {
    if (!quiz) return
    const unanswered = quiz.questions.filter(q => userAnswers[q.id] === undefined)
    if (unanswered.length > 0) {
      setToast(`Please answer all questions (${unanswered.length} remaining).`)
      setTimeout(() => setToast(''), 3000)
      return
    }
    let correct = 0
    quiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correct_answer) correct++
    })
    setScore(correct)
    setSubmitted(true)
  }

  const handleRetry = () => {
    setUserAnswers({})
    setSubmitted(false)
    setScore(null)
  }

  const handleNewQuiz = () => {
    setQuiz(null)
    setUserAnswers({})
    setSubmitted(false)
    setScore(null)
    setTopic('')
    setError('')
  }

  const getOptionStyle = (question, optionIndex) => {
    const selected = userAnswers[question.id] === optionIndex
    const correct = question.correct_answer === optionIndex

    if (!submitted) {
      return selected
        ? 'border-blue-500 bg-blue-500/10 text-blue-200'
        : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
    }

    if (correct) return 'border-green-500 bg-green-500/10 text-green-200'
    if (selected && !correct) return 'border-red-500 bg-red-500/10 text-red-200'
    return 'border-slate-600/30 bg-slate-800/30 text-slate-500'
  }

  const scorePercent = quiz ? Math.round((score / quiz.total) * 100) : 0
  const scoreColor = scorePercent >= 80 ? 'text-green-400' : scorePercent >= 60 ? 'text-yellow-400' : 'text-red-400'
  const scoreEmoji = scorePercent >= 80 ? '🎉' : scorePercent >= 60 ? '👍' : '📚'
  const scoreMsg = scorePercent >= 80 ? 'Excellent work!' : scorePercent >= 60 ? 'Good effort!' : 'Keep practising!'

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="🎯"
        title="Quiz Generator"
        subtitle="Test your knowledge with AI-generated multiple choice questions."
      />

      {/* Config form */}
      {!quiz && (
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
                placeholder="e.g. World War II, Python Lists, Human Digestive System..."
                className="input-field"
                disabled={loading}
                maxLength={200}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      disabled={loading}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        difficulty === d
                          ? d === 'Easy'   ? 'border-green-500 bg-green-500/20 text-green-300'
                          : d === 'Medium' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
                                           : 'border-red-500 bg-red-500/20 text-red-300'
                          : 'border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Questions
                </label>
                <select
                  value={numQuestions}
                  onChange={e => setNumQuestions(Number(e.target.value))}
                  className="input-field"
                  disabled={loading}
                >
                  {[3, 5, 7, 10].map(n => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Generating quiz...
                </>
              ) : (
                <>
                  <span>🎯</span>
                  Generate Quiz
                </>
              )}
            </button>
          </form>

          {loading && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl fade-in">
              <Spinner />
              <div>
                <p className="text-cyan-300 font-medium">Crafting your quiz...</p>
                <p className="text-cyan-400/70 text-sm">Creating {numQuestions} {difficulty.toLowerCase()} questions on "{topic}"</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && <div className="mb-4"><ErrorBox message={error} /></div>}

      {/* Toast */}
      {toast && (
        <div className="mb-4">
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm fade-in">
            <span>⚠️</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Score banner */}
      {submitted && score !== null && (
        <div className="glass-card p-6 mb-6 text-center fade-in border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="text-5xl mb-3">{scoreEmoji}</div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">{scoreMsg}</h2>
          <p className="text-slate-300 mb-3">
            You scored <span className={`text-3xl font-bold ${scoreColor}`}>{score}/{quiz.total}</span>
          </p>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-4 mx-auto max-w-xs">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                scorePercent >= 80 ? 'bg-green-500' : scorePercent >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className={`text-xl font-bold ${scoreColor}`}>{scorePercent}%</p>
          <div className="flex justify-center gap-3 mt-4">
            <button className="btn-secondary" onClick={handleRetry}>🔄 Retry Quiz</button>
            <button className="btn-primary" onClick={handleNewQuiz}>✨ New Quiz</button>
          </div>
        </div>
      )}

      {/* Quiz questions */}
      {quiz && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{quiz.topic} Quiz</h2>
              <p className="text-sm text-slate-400">{quiz.total} questions · {quiz.difficulty}</p>
            </div>
            {!submitted && (
              <div className="text-sm text-slate-400">
                {Object.keys(userAnswers).length}/{quiz.total} answered
              </div>
            )}
          </div>

          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="glass-card p-5 fade-in">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-sm font-bold text-blue-400">
                  {idx + 1}
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">{q.question}</p>
              </div>

              <div className="space-y-2 ml-10">
                {q.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(q.id, optIdx)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-200 ${getOptionStyle(q, optIdx)}`}
                  >
                    <span className="font-semibold mr-2">
                      {['A', 'B', 'C', 'D'][optIdx]}.
                    </span>
                    {option}
                    {submitted && q.correct_answer === optIdx && (
                      <span className="float-right text-green-400">✓</span>
                    )}
                    {submitted && userAnswers[q.id] === optIdx && q.correct_answer !== optIdx && (
                      <span className="float-right text-red-400">✗</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="ml-10 mt-3 p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                  <p className="text-xs font-semibold text-slate-400 mb-1">💡 Explanation:</p>
                  <p className="text-sm text-slate-300">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}

          {/* Submit button */}
          {!submitted && (
            <div className="flex gap-3 justify-end">
              <button className="btn-secondary" onClick={handleNewQuiz}>← New Quiz</button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length < quiz.total}
              >
                Submit Quiz ({Object.keys(userAnswers).length}/{quiz.total})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!quiz && !loading && !error && (
        <EmptyState
          icon="🎯"
          title="No quiz yet"
          description="Enter a topic, choose difficulty and number of questions, then click Generate Quiz."
        />
      )}
    </div>
  )
}

