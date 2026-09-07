const TOOL_CONFIG = {
  lookup_order: {
    label: 'Lookup Order',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  get_account_status: {
    label: 'Account Status',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  create_ticket: {
    label: 'Create Ticket',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  escalate_to_human: {
    label: 'Escalate',
    border: 'border-red-300',
    bg: 'bg-red-50',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
}

export function ToolCallCard({ toolName, callCount }) {
  const config = TOOL_CONFIG[toolName] || {
    label: toolName,
    border: 'border-slate-300',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    icon: <span className="w-4 h-4 text-slate-500">⚙</span>,
  }

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${config.border} ${config.bg}`}>
      <span className={config.text}>{config.icon}</span>
      <span className={`text-sm font-medium ${config.text} flex-1`}>{config.label}</span>
      {callCount > 1 && (
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${config.badge}`}>
          ×{callCount}
        </span>
      )}
    </div>
  )
}
