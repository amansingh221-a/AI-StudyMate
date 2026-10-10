import React from 'react'

/**
 * Reusable loading spinner
 */
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <svg
      className={`${sizes[size]} spinner text-blue-500`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/**
 * Error message box
 */
export function ErrorBox({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm fade-in">
      <span className="text-xl mt-0.5">❌</span>
      <div>
        <strong className="block font-semibold text-red-200 mb-1">Something went wrong</strong>
        {message}
      </div>
    </div>
  )
}

/**
 * Success toast notification
 */
export function SuccessToast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm fade-in">
      <span className="text-lg">✅</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-green-400 hover:text-green-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Page header with title and subtitle
 */
export function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl">{icon}</span>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
      </div>
      {subtitle && <p className="text-slate-400 ml-12">{subtitle}</p>}
    </div>
  )
}

/**
 * Empty state illustration
 */
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm">{description}</p>
    </div>
  )
}

