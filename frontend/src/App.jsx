import { useChat } from './hooks/useChat'
import { ChatPanel } from './components/ChatPanel'
import { SupervisorPanel } from './components/SupervisorPanel'

export default function App() {
  const { messages, supervisorData, selectedCustomerId, isLoading, sendMessage, switchCustomer } =
    useChat()

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <header className="bg-[#1e293b] text-white h-14 flex items-center px-6 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">TechMart AI Support Center</p>
            <p className="text-xs text-slate-400 leading-tight">CCAI Autonomous Agent Demo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Gemini 3.6 Flash Connected
          </div>
          <div className="flex items-center gap-1.5 bg-slate-700 rounded-full px-3 py-1">
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-slate-300">Supervisor Mode</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-2/5 min-w-0 border-r border-slate-200 flex flex-col bg-white shadow-sm">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            selectedCustomerId={selectedCustomerId}
            sendMessage={sendMessage}
            switchCustomer={switchCustomer}
          />
        </div>
        <div className="w-3/5 min-w-0 flex flex-col bg-white">
          <SupervisorPanel supervisorData={supervisorData} />
        </div>
      </main>
    </div>
  )
}
