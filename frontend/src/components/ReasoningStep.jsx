import { useState } from 'react'

const TOOL_ICONS = {
  lookup_order: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  get_account_status: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  create_ticket: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  escalate_to_human: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
}

function CollapsibleJSON({ data, label }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
      >
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {label}
      </button>
      {open && (
        <pre className="mt-1 text-xs bg-slate-800 text-green-300 rounded-md p-2 overflow-x-auto leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function ReasoningStep({ step, index = 0, isLast }) {
  const delayStyle = { animationDelay: `${index * 300}ms` }

  if (step.type === 'final_response') {
    return (
      <div className="flex gap-3 step-animate" style={delayStyle}>
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="pb-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-green-700">Final Response</span>
            <span className="text-xs text-slate-400">Step {step.step}</span>
          </div>
          <p className="text-xs text-slate-500 italic">{step.thought}</p>
          {step.final_response && (
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              "{step.final_response.slice(0, 120)}{step.final_response.length > 120 ? '…' : ''}"
            </p>
          )}
        </div>
      </div>
    )
  }

  const icon = TOOL_ICONS[step.tool_name] || (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  )

  return (
    <div className="flex gap-3 step-animate" style={delayStyle}>
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
          {icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1 mb-0" />}
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-slate-700 font-mono">{step.tool_name}</span>
          <span className="text-xs text-slate-400">Step {step.step}</span>
        </div>
        <p className="text-xs text-slate-500 italic mb-1">{step.thought}</p>
        {step.tool_input && Object.keys(step.tool_input).length > 0 && (
          <CollapsibleJSON data={step.tool_input} label="Input" />
        )}
        {step.tool_output && (
          <CollapsibleJSON data={step.tool_output} label="Output" />
        )}
      </div>
    </div>
  )
}
