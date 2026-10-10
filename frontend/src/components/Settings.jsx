import React from 'react'
import { PageHeader } from './UIComponents.jsx'

export default function Settings({ healthStatus }) {
  const isConfigured = healthStatus?.api_key_configured
  const model = healthStatus?.model || 'gemini-2.5-flash'

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        icon="⚙️"
        title="Settings"
        subtitle="Configure your AI StudyMate application."
      />

      {/* API Status */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">🔌 Backend Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
            <span className="text-sm text-slate-300">Backend Server</span>
            {healthStatus ? (
              healthStatus.status === 'healthy' ? (
                <span className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  Error
                </span>
              )
            ) : (
              <span className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                Checking...
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
            <span className="text-sm text-slate-300">Gemini API Key</span>
            {isConfigured === undefined ? (
              <span className="text-slate-400 text-sm">Unknown</span>
            ) : isConfigured ? (
              <span className="flex items-center gap-2 text-green-400 text-sm">
                <span>✓</span> Configured
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-400 text-sm">
                <span>✗</span> Not set
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
            <span className="text-sm text-slate-300">AI Model</span>
            <span className="text-blue-400 text-sm font-mono">{model}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
            <span className="text-sm text-slate-300">Backend URL</span>
            <span className="text-slate-400 text-sm font-mono">http://127.0.0.1:8000</span>
          </div>
        </div>
      </div>

      {/* Setup instructions */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">🔑 Configure Your API Key</h2>

        {isConfigured ? (
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm">
            <span className="text-2xl">✅</span>
            <div>
              <strong className="block font-semibold text-green-200 mb-1">All set!</strong>
              Your Gemini API key is configured and the AI features are ready to use.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
              <span className="text-2xl">⚠️</span>
              <div>
                <strong className="block font-semibold text-amber-200 mb-1">API key required</strong>
                You need a free Google Gemini API key to use the AI features. Follow the steps below.
              </div>
            </div>

            <ol className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Get a free Gemini API key',
                  content: (
                    <>
                      Visit{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Google AI Studio
                      </a>{' '}
                      and sign in with your Google account. Click "Get API Key" and create a new key. Copy it.
                    </>
                  ),
                },
                {
                  step: 2,
                  title: 'Create the backend/.env file',
                  content: (
                    <>
                      In your project folder, open the <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">backend/</code> folder.
                      Copy <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">.env.example</code> to{' '}
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">.env</code> (no "example" suffix).
                    </>
                  ),
                },
                {
                  step: 3,
                  title: 'Paste your API key',
                  content: (
                    <>
                      Open <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">backend/.env</code> in any text editor and replace{' '}
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">your_gemini_api_key_here</code> with your actual key.
                    </>
                  ),
                },
                {
                  step: 4,
                  title: 'Restart the backend',
                  content: (
                    <>
                      Stop the backend server (press <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">Ctrl+C</kbd>) and run{' '}
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">python -m uvicorn main:app --reload</code> again from the{' '}
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs">backend/</code> folder.
                    </>
                  ),
                },
              ].map(({ step, title, content }) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-sm font-bold text-blue-400 mt-0.5">
                    {step}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-200 text-sm mb-0.5">{title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">ℹ️ About AI StudyMate</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span>Version</span>
            <span className="text-slate-300 font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span>Frontend</span>
            <span className="text-slate-300">React + Vite + Tailwind CSS</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span>Backend</span>
            <span className="text-slate-300">Python + FastAPI</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>AI Provider</span>
            <span className="text-slate-300">Google Gemini</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          ⚠️ Your API key is stored only in your local <code>backend/.env</code> file and is never sent to the browser.
        </p>
      </div>
    </div>
  )
}

