import React, { useState, useEffect } from 'react'
import { PageHeader, SuccessToast, EmptyState } from './UIComponents.jsx'

const STORAGE_KEY = 'ai_studymate_tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export default function StudyPlanner() {
  const [tasks, setTasks] = useState(loadTasks)
  const [form, setForm] = useState({ subject: '', topic: '', date: '', priority: 'Medium' })
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all') // all | pending | done

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.topic.trim()) {
      showToast('Subject and topic are required.')
      return
    }
    const task = {
      id: Date.now(),
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      date: form.date,
      priority: form.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [task, ...prev])
    setForm({ subject: '', topic: '', date: '', priority: 'Medium' })
    showToast('Study task added! 📚')
  }

  const handleToggle = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    showToast('Task deleted.')
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const priorityColors = {
    High: 'text-red-400 bg-red-400/10 border-red-400/30',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Low: 'text-green-400 bg-green-400/10 border-green-400/30',
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="📅"
        title="Study Planner"
        subtitle="Organise your study sessions and track your progress. All data is saved locally in your browser."
      />

      {/* Toast */}
      {toast && (
        <div className="mb-4">
          <SuccessToast message={toast} onClose={() => setToast('')} />
        </div>
      )}

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Overall Progress</p>
            <p className="text-sm text-slate-400">{completedCount}/{totalCount} completed</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{progress}% done</p>
        </div>
      )}

      {/* Add task form */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">➕ Add Study Task</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Mathematics, Physics..."
                className="input-field"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Topic <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                placeholder="e.g. Integration, Newton's Laws..."
                className="input-field"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Study Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="input-field"
                min={today}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      form.priority === p
                        ? priorityColors[p]
                        : 'border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={!form.subject.trim() || !form.topic.trim()}
          >
            <span>➕</span>
            Add Task
          </button>
        </form>
      </div>

      {/* Filter tabs */}
      {tasks.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {[
            { key: 'all', label: `All (${tasks.length})` },
            { key: 'pending', label: `Pending (${tasks.length - completedCount})` },
            { key: 'done', label: `Done (${completedCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                  : 'bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Task list */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isOverdue = task.date && task.date < today && !task.completed
            return (
              <div
                key={task.id}
                className={`glass-card p-4 flex items-start gap-4 transition-all duration-200 fade-in ${
                  task.completed ? 'opacity-60' : ''
                } ${isOverdue ? 'border-red-500/30' : ''}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-500 hover:border-blue-400'
                  }`}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-200 text-sm">{task.subject}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    {isOverdue && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/30 text-red-400">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className={`text-slate-300 text-sm ${task.completed ? 'line-through text-slate-500' : ''}`}>
                    {task.topic}
                  </p>
                  {task.date && (
                    <p className="text-xs text-slate-500 mt-1">
                      📅{' '}
                      {new Date(task.date + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  aria-label="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No study tasks yet"
          description="Add your first study task using the form above. All tasks are saved in your browser."
        />
      ) : (
        <EmptyState
          icon="✅"
          title={filter === 'done' ? 'No completed tasks yet' : 'All tasks completed!'}
          description={filter === 'done' ? 'Complete some tasks to see them here.' : 'Great job! You\'re all caught up.'}
        />
      )}
    </div>
  )
}

