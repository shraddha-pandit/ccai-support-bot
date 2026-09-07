import { CSATBadge } from './CSATBadge'
import { EscalationBanner } from './EscalationBanner'
import { ReasoningStep } from './ReasoningStep'
import { ToolCallCard } from './ToolCallCard'

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  )
}

export function SupervisorPanel({ supervisorData }) {
  const { toolsCalled, reasoningSteps, csatScore, csatLabel, escalated, escalationAgent } =
    supervisorData

  const toolCounts = toolsCalled.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})
  const uniqueTools = Object.keys(toolCounts)

  const isEmpty = csatScore === null && reasoningSteps.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-sm font-semibold text-slate-700">Supervisor View</h2>
        </div>
        <span className="text-xs text-slate-400">Live Agent Analytics</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Awaiting first interaction</p>
            <p className="text-slate-300 text-xs mt-1">
              Reasoning chain, tool calls, and CSAT will appear here
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-stretch">
              <div className="flex-1">
                <CSATBadge score={csatScore} label={csatLabel} />
              </div>
              <div className="flex items-center px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">Tools Used</p>
                  <p className="text-2xl font-bold text-slate-700">{toolsCalled.length}</p>
                </div>
              </div>
              <div
                className={`flex items-center px-3 py-2 rounded-xl border ${
                  escalated
                    ? 'border-red-200 bg-red-50'
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">Status</p>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${
                      escalated ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {escalated ? 'Escalated' : 'AI Resolved'}
                  </p>
                </div>
              </div>
            </div>

            <EscalationBanner escalated={escalated} agentName={escalationAgent} />

            {reasoningSteps.length > 0 && (
              <>
                <SectionDivider label="Reasoning Chain" />
                <div>
                  {reasoningSteps.map((step, idx) => (
                    <ReasoningStep
                      key={step.step}
                      step={step}
                      index={idx}
                      isLast={idx === reasoningSteps.length - 1}
                    />
                  ))}
                </div>
              </>
            )}

            {uniqueTools.length > 0 && (
              <>
                <SectionDivider label="Tools Invoked" />
                <div className="flex flex-col gap-2">
                  {uniqueTools.map((tool) => (
                    <ToolCallCard key={tool} toolName={tool} callCount={toolCounts[tool]} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
