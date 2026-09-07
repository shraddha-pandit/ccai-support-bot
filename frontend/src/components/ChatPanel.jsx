import { useRef, useEffect, useState } from 'react'
import { CustomerSelector } from './CustomerSelector'
import { MessageBubble } from './MessageBubble'

function TypingIndicator() {
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
        <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm inline-flex items-center gap-1.5">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export function ChatPanel({ messages, isLoading, selectedCustomerId, sendMessage, switchCustomer }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomerSelector
        selectedCustomerId={selectedCustomerId}
        onSwitch={switchCustomer}
      />

      <div className="flex-1 overflow-y-auto custom-scroll p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">Start the conversation</p>
            <p className="text-slate-400 text-xs mt-1 max-w-xs">
              Ask about an order, account status, or any issue — the AI will handle it autonomously.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                'Where is my order?',
                'What is my account balance?',
                'I need help with a return',
                'Connect me to a human agent',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { sendMessage(suggestion) }}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 bg-white flex-shrink-0">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[
            'Where is my order?',
            'I was charged twice',
            'I need help with a return',
            'Connect me to a human agent',
          ].map((scenario) => (
            <button
              key={scenario}
              onClick={() => sendMessage(scenario)}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 border border-slate-200 rounded-full transition-colors whitespace-nowrap"
            >
              {scenario}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none text-sm border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '42px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 text-center">
          Powered by Gemini 3.6 Flash · CCAI Demo
        </p>
      </div>
    </div>
  )
}
