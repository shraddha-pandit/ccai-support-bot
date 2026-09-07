from pydantic import BaseModel


class ConversationMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    customer_id: str
    conversation_history: list[ConversationMessage] = []


class ReasoningStep(BaseModel):
    step: int
    type: str
    thought: str
    tool_name: str | None = None
    tool_input: dict | None = None
    tool_output: dict | None = None
    final_response: str | None = None


class ChatResponse(BaseModel):
    reply: str
    tools_called: list[str]
    reasoning_steps: list[ReasoningStep]
    csat_score: float
    escalated: bool
    escalation_agent: str | None = None
