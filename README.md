# TechMart CCAI Support Bot Demo

A full-stack autonomous AI customer support demo using **Google Gemini 3.6 Flash** with function calling, built with **FastAPI** (backend) and **React + Tailwind** (frontend).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (port 3000)            │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │   Chat Panel     │  │      Supervisor Panel        │ │
│  │  - Customer list │  │  - CSAT score badge          │ │
│  │  - Chat messages │  │  - Reasoning chain timeline  │ │
│  │  - Send input    │  │  - Tool call cards           │ │
│  │                  │  │  - Escalation banner         │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │ POST /chat
┌────────────────────▼────────────────────────────────────┐
│               FastAPI Backend (port 8000)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Gemini 2.0 Flash Agent Loop            │   │
│  │  User message → Gemini → function_call?          │   │
│  │       ↓ YES                      ↓ NO            │   │
│  │  Execute tool → send result → Final reply        │   │
│  └──────────────────────────────────────────────────┘   │
│  Tools: lookup_order · get_account_status               │
│         create_ticket · escalate_to_human               │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Python 3.10+
- Node 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier works)

## Quick Start

### 1. Backend

```bash
cd backend

# Create a virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set your API key
copy .env.example .env
# Edit .env and set GOOGLE_API_KEY=your_key_here

# Start the server
uvicorn backend.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Visit `/docs` for the interactive Swagger UI.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Customer Personas

| ID | Name | Plan | Status | Notes |
|---|---|---|---|---|
| CUST-001 | John Martinez | Premium | Active | Loyal customer since 2019 |
| CUST-002 | Sarah Chen | Standard | Active | Open billing dispute |
| CUST-003 | Robert Johnson | Enterprise | Active | Corporate account |
| CUST-004 | Emily Rodriguez | Basic | Overdue | Payment overdue 45 days |
| CUST-005 | Michael Thompson | Premium | Active | Prior delivery complaints |
| CUST-006 | Lisa Anderson | Standard | Pending Cancellation | Retention offer pending |
| CUST-007 | David Kim | Enterprise | Active | VIP / CTO of TechCorp |
| CUST-008 | Jennifer Williams | Basic | Active | New customer |
| CUST-009 | Christopher Davis | Premium | Active | Platinum rewards member |
| CUST-010 | Amanda Wilson | Standard | Locked | Suspicious login activity |

## Available Tools

| Tool | Description | Triggers |
|---|---|---|
| `lookup_order` | Returns order status, item, carrier, delivery date | Questions about orders/deliveries |
| `get_account_status` | Returns plan, balance, account health | Questions about account/billing |
| `create_ticket` | Creates a support ticket with ID and ETA | Unresolvable issues |
| `escalate_to_human` | Connects to a human agent | Disputes >$500, legal, or explicit request |

## API Reference

### POST /chat

```json
{
  "message": "Where is my order?",
  "customer_id": "CUST-001",
  "conversation_history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello John! How can I help?" }
  ]
}
```

Response:
```json
{
  "reply": "Your iPhone 15 Pro has been shipped via FedEx...",
  "tools_called": ["lookup_order"],
  "reasoning_steps": [...],
  "csat_score": 4.7,
  "escalated": false,
  "escalation_agent": null
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Google AI Studio API key for Gemini |

## Test Scenarios

Try these prompts with different customers to see the agent in action:

- **John Martinez** → "Where is my order?" (triggers `lookup_order`)
- **Emily Rodriguez** → "What is my account balance?" (triggers `get_account_status`, reveals overdue status)
- **Michael Thompson** → "My iPad hasn't arrived yet, this is ridiculous" (triggers ticket creation, CSAT drops)
- **Any customer** → "I want to speak to a human right now" (triggers `escalate_to_human`, EscalationBanner appears)
- **Sarah Chen** → "Can you check my order and account?" (triggers multiple tools sequentially)
