export function EscalationBanner({ escalated, agentName }) {
  if (!escalated) return null

  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
      <div className="relative flex-shrink-0">
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
        <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-700">Escalated to Human Agent</p>
        {agentName && (
          <p className="text-xs text-red-500 truncate">Assigned to: {agentName}</p>
        )}
      </div>
    </div>
  )
}
