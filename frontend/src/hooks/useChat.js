import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sendChatMessage } from '../api/chatApi'

const INITIAL_SUPERVISOR = {
  toolsCalled: [],
  reasoningSteps: [],
  csatScore: null,
  csatLabel: null,
  escalated: false,
  escalationAgent: null,
}

function getCsatLabel(score) {
  if (score >= 4.5) return 'Excellent'
  if (score >= 3.5) return 'Good'
  if (score >= 2.5) return 'Fair'
  return 'Poor'
}

export function useChat() {
  const [messages, setMessages] = useState([])
  const [conversationHistory, setConversationHistory] = useState([])
  const [supervisorData, setSupervisorData] = useState(INITIAL_SUPERVISOR)
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST-001')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return

      const userMsg = {
        id: uuidv4(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const historyForApi = [...conversationHistory, { role: 'user', content: text }]

      try {
        const data = await sendChatMessage({
          message: text,
          customerId: selectedCustomerId,
          conversationHistory,
        })

        const assistantMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])
        setConversationHistory([
          ...historyForApi,
          { role: 'assistant', content: data.reply },
        ])

        setSupervisorData({
          toolsCalled: data.tools_called,
          reasoningSteps: data.reasoning_steps,
          csatScore: data.csat_score,
          csatLabel: getCsatLabel(data.csat_score),
          escalated: data.escalated,
          escalationAgent: data.escalation_agent,
        })
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [conversationHistory, selectedCustomerId, isLoading],
  )

  const switchCustomer = useCallback((customerId) => {
    setSelectedCustomerId(customerId)
    setMessages([])
    setConversationHistory([])
    setSupervisorData(INITIAL_SUPERVISOR)
  }, [])

  return {
    messages,
    supervisorData,
    selectedCustomerId,
    isLoading,
    sendMessage,
    switchCustomer,
  }
}
