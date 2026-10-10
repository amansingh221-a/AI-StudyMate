import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import NotesGenerator from './components/NotesGenerator.jsx'
import DoubtSolver from './components/DoubtSolver.jsx'
import QuizGenerator from './components/QuizGenerator.jsx'
import StudyPlanner from './components/StudyPlanner.jsx'
import Settings from './components/Settings.jsx'
import { checkHealth } from './api.js'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [healthStatus, setHealthStatus] = useState(null)

  useEffect(() => {
    checkHealth()
      .then(data => setHealthStatus(data))
      .catch(() => setHealthStatus({ status: 'error', api_key_configured: false }))
  }, [])

  const navigate = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':    return <Dashboard navigate={navigate} healthStatus={healthStatus} />
      case 'notes':        return <NotesGenerator />
      case 'doubt':        return <DoubtSolver />
      case 'quiz':         return <QuizGenerator />
      case 'planner':      return <StudyPlanner />
      case 'settings':     return <Settings healthStatus={healthStatus} />
      default:             return <Dashboard navigate={navigate} healthStatus={healthStatus} />
    }
  }

  return (
    <div className="flex h-screen bg-slate-900 gradient-bg overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold text-slate-100">AI StudyMate</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* API key warning banner */}
          {healthStatus && !healthStatus.api_key_configured && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-start gap-2">
              <span className="text-lg mt-0.5">⚠️</span>
              <div>
                <strong>API key not configured.</strong> Go to{' '}
                <button
                  onClick={() => navigate('settings')}
                  className="underline hover:text-amber-200"
                >
                  Settings
                </button>{' '}
                to see setup instructions.
              </div>
            </div>
          )}
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

