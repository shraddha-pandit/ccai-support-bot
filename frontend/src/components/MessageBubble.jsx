function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[78%]">
          <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[78%]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
          </div>
          <span className="text-xs font-medium text-slate-500">TechMart AI</span>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
            message.isError
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {message.content}
        </div>
        <p className="text-xs text-slate-400 mt-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  )
}
