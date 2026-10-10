import React from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',       icon: '🏠' },
  { id: 'notes',     label: 'Notes Generator', icon: '📝' },
  { id: 'doubt',     label: 'Doubt Solver',    icon: '💡' },
  { id: 'quiz',      label: 'Quiz Generator',  icon: '🎯' },
  { id: 'planner',   label: 'Study Planner',   icon: '📅' },
  { id: 'settings',  label: 'Settings',        icon: '⚙️' },
]

export default function Sidebar({ currentPage, navigate, isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800/50 border-r border-slate-700/50 backdrop-blur-sm">
        <SidebarContent currentPage={currentPage} navigate={navigate} />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-slate-800 border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-slate-100">AI StudyMate</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent currentPage={currentPage} navigate={navigate} />
      </aside>
    </>
  )
}

function SidebarContent({ currentPage, navigate }) {
  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Logo */}
      <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
          🎓
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-lg leading-none">AI StudyMate</h1>
          <p className="text-xs text-slate-400 mt-0.5">Powered by Gemini</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">
          Menu
        </p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`nav-item w-full text-left ${currentPage === item.id ? 'active' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20">
          <p className="text-xs text-slate-400">Built with</p>
          <p className="text-sm font-semibold text-blue-400">Google Gemini AI ✨</p>
        </div>
      </div>
    </div>
  )
}

