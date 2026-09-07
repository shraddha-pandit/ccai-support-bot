from google import genai
from google.genai import types

from config import GOOGLE_API_KEY, GEMINI_MODEL, MAX_TOOL_ITERATIONS, MAX_HISTORY_TURNS
from customers import get_customer
from tools import execute_tool, get_gemini_tool_declarations

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=GOOGLE_API_KEY)
    return _client


_TOOL_THOUGHTS = {
    "lookup_order": "Retrieving order details from the system.",
    "get_account_status": "Checking account information and current standing.",
    "create_ticket": "Creating a support ticket to track this issue.",
    "escalate_to_human": "Escalating to a human agent for specialised handling.",
}

_NEGATIVE_KEYWORDS = {
    "angry", "frustrated", "terrible", "awful", "horrible", "worst", "useless",
    "incompetent", "ridiculous", "unacceptable", "disappointed", "upset",
    "furious", "disgusted", "pathetic", "never", "scam",
}

_POSITIVE_KEYWORDS = {
    "thank", "great", "excellent", "perfect", "wonderful", "amazing", "helpful",
    "appreciate", "satisfied", "happy", "resolved", "solved", "fantastic", "quick",
}


def _build_system_prompt(customer: dict) -> str:
    return f"""You are a professional customer support agent for TechMart, an online electronics retailer.

CUSTOMER CONTEXT:
- Name: {customer['name']}
- Customer ID: {customer['id']}
- Plan: {customer['plan']}
- Account Status: {customer['account_status']}
- Member Since: {customer['member_since']}
- Notes: {customer['notes']}

BEHAVIOURAL RULES:
1. Always call tools to retrieve actual data before answering questions about orders or accounts.
2. When calling get_account_status, always pass customer_id = "{customer['id']}".
3. Create a ticket if an issue cannot be immediately resolved.
4. Escalate to human ONLY for: disputes over $500, legal requests, or explicit customer demand.
5. Always end your response with a plain text message to the customer — never end on a tool call.
6. Be concise, empathetic, and professional. Address the customer by first name.
7. If the account is Locked or Overdue, acknowledge the situation sensitively before diving into the issue."""


def _build_gemini_history(conversation_history: list) -> list:
    trimmed = conversation_history[-(MAX_HISTORY_TURNS * 2):]
    result = []
    for msg in trimmed:
        role = "model" if msg.role == "assistant" else "user"
        result.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))
    return result


def compute_csat(message: str, tools_called: list[str], escalated: bool) -> float:
    score = 5.0
    words = set(message.lower().split())

    if escalated:
        score -= 1.5

    tool_count = len(tools_called)
    if tool_count > 3:
        score -= 1.0
    elif tool_count == 3:
        score -= 0.5

    neg_hits = words & _NEGATIVE_KEYWORDS
    score -= min(len(neg_hits) * 0.5, 1.5)

    if tool_count <= 1:
        score += 0.2

    pos_hits = words & _POSITIVE_KEYWORDS
    score += min(len(pos_hits) * 0.2, 0.5)

    return round(max(1.0, min(5.0, score)), 1)


async def run_agent_loop(message: str, customer_id: str, conversation_history: list) -> dict:
    customer = get_customer(customer_id)
    if not customer:
        return {
            "reply": "I'm sorry, I couldn't find your account. Please contact support.",
            "tools_called": [],
            "reasoning_steps": [],
            "csat_score": 1.0,
            "escalated": False,
            "escalation_agent": None,
        }

    system_prompt = _build_system_prompt(customer)
    gemini_history = _build_gemini_history(conversation_history)
    tool_declarations = get_gemini_tool_declarations()

    # Disable automatic_function_calling so the SDK surfaces raw function_call
    # parts to us instead of trying to auto-execute them (which would fail since
    # we handle execution ourselves).
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        tools=tool_declarations,
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
    )

    chat = _get_client().aio.chats.create(
        model=GEMINI_MODEL,
        config=config,
        history=gemini_history,
    )

    reasoning_steps: list[dict] = []
    tools_called: list[str] = []
    final_reply = ""
    escalation_agent = None
    step = 0

    response = await chat.send_message(message)

    while step < MAX_TOOL_ITERATIONS:
        step += 1

        # response.function_calls is a 2.x shortcut: list of FunctionCall objects
        # from the first candidate, or None if no function calls in this turn.
        fc_list = response.function_calls

        if not fc_list:
            # No function calls — this is the final text reply.
            final_reply = response.text or ""
            reasoning_steps.append(
                {
                    "step": step,
                    "type": "final_response",
                    "thought": "All information gathered. Composing response.",
                    "final_response": final_reply,
                }
            )
            break

        function_response_parts = []
        for fc in fc_list:
            tool_name = fc.name
            tool_args = dict(fc.args) if fc.args else {}
            tool_result = execute_tool(tool_name, tool_args, customer_id)

            reasoning_steps.append(
                {
                    "step": step,
                    "type": "tool_call",
                    "thought": _TOOL_THOUGHTS.get(tool_name, f"Invoking {tool_name}."),
                    "tool_name": tool_name,
                    "tool_input": tool_args,
                    "tool_output": tool_result,
                }
            )
            tools_called.append(tool_name)

            if tool_name == "escalate_to_human" and "agent" in tool_result:
                escalation_agent = tool_result["agent"]["name"]

            # Use the recommended 2.x helper to build function response parts.
            function_response_parts.append(
                types.Part.from_function_response(
                    name=tool_name,
                    response={"result": tool_result},
                )
            )

        response = await chat.send_message(function_response_parts)

    escalated = "escalate_to_human" in tools_called
    csat = compute_csat(message, tools_called, escalated)

    return {
        "reply": final_reply,
        "tools_called": tools_called,
        "reasoning_steps": reasoning_steps,
        "csat_score": csat,
        "escalated": escalated,
        "escalation_agent": escalation_agent,
    }
