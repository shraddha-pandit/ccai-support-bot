import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

export async function fetchCustomers() {
  const res = await axios.get(`${BASE_URL}/customers`)
  return res.data.customers
}

export async function sendChatMessage({ message, customerId, conversationHistory }) {
  const res = await axios.post(`${BASE_URL}/chat`, {
    message,
    customer_id: customerId,
    conversation_history: conversationHistory,
  })
  return res.data
}
