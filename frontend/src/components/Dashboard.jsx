import React from 'react'

export default function Dashboard({ navigate, healthStatus }) {
  const quickActions = [
    {
      id: 'notes',
      icon: '📝',
      title: 'Notes Generator',
      description: 'Generate comprehensive study notes on any topic instantly.',
      gradient: 'from-blue-600/20 to-blue-500/10',
      border: 'border-blue-500/30',
      btnColor: 'bg-blue-600 hover:bg-blue-500',
      tag: 'AI Powered',
    },
    {
      id: 'doubt',
      icon: '💡',
      title: 'Doubt Solver',
      description: 'Get step-by-step explanations for any academic question.',
      gradient: 'from-purple-600/20 to-purple-500/10',
      border: 'border-purple-500/30',
      btnColor: 'bg-purple-600 hover:bg-purple-500',
      tag: 'Step-by-step',
    },
    {
      id: 'quiz',
      icon: '🎯',
      title: 'Quiz Generator',
      description: 'Test your knowledge with AI-generated multiple choice quizzes.',
      gradient: 'from-cyan-600/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      btnColor: 'bg-cyan-600 hover:bg-cyan-500',
      tag: 'Interactive',
    },
    {
      id: 'planner',
      icon: '📅',
      title: 'Study Planner',
      description: 'Organise your study schedule and track your progress.',
      gradient: 'from-emerald-600/20 to-emerald-500/10',
      border: 'border-emerald-500/30',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500',
      tag: 'Personal',
    },
  ]

  const stats = [
    { label: 'AI Tools', value: '4', icon: '🤖' },
    { label: 'Subjects Covered', value: '∞', icon: '📚' },
    { label: 'Always Available', value: '24/7', icon: '⚡' },
  ]

  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="glass-card p-6 lg:p-8 mb-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 border-blue-500/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />

        <div className="relative">
          <p className="text-slate-400 text-sm font-medium mb-1">{greeting}! 👋</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI StudyMate
            </span>
          </h1>
          <p className="text-slate-300 text-base lg:text-lg max-w-xl">
            Your intelligent study companion powered by Google Gemini. Generate notes, solve doubts,
            take quizzes, and plan your studies — all in one place.
          </p>

          {/* Status indicator */}
          <div className="flex items-center gap-2 mt-4">
            {healthStatus ? (
              healthStatus.api_key_configured ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-300 text-xs font-medium">AI Ready — {healthStatus.model}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-300 text-xs font-medium">API key not set — configure in Settings</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-slate-400 text-xs font-medium">Connecting to backend...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick action cards */}
      <h2 className="text-xl font-semibold text-slate-200 mb-4">🚀 Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {quickActions.map(action => (
          <div
            key={action.id}
            className={`glass-card p-5 bg-gradient-to-br ${action.gradient} border ${action.border} hover:scale-[1.01] transition-all duration-200 cursor-pointer group`}
            onClick={() => navigate(action.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800/60 rounded-xl flex items-center justify-center text-2xl">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">{action.title}</h3>
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">{action.tag}</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{action.description}</p>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(action.id) }}
              className={`mt-4 ${action.btnColor} text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200`}
            >
              Open →
            </button>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">💡 Study Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { tip: "Use the Notes Generator before lectures to preview topics.", icon: "📖" },
            { tip: "Take the Quiz after studying to reinforce your memory.", icon: "🧠" },
            { tip: "Add tasks in Study Planner to stay organised and on track.", icon: "✅" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-xl">
              <span className="text-xl">{item.icon}</span>
              <p className="text-slate-400 text-sm leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

