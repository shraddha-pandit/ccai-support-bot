import itertools
import random
import uuid
from datetime import datetime

from google.genai import types

from customers import CUSTOMERS

ORDERS = {
    "ORD-1001": {
        "order_id": "ORD-1001",
        "customer_id": "CUST-001",
        "item": "iPhone 15 Pro (256GB, Natural Titanium)",
        "status": "Shipped",
        "carrier": "FedEx",
        "tracking_number": "794644792798",
        "estimated_delivery": "2026-09-10",
        "amount_usd": 1199.00,
    },
    "ORD-1002": {
        "order_id": "ORD-1002",
        "customer_id": "CUST-002",
        "item": "MacBook Air M3 (13-inch, 16GB RAM, 512GB SSD)",
        "status": "Processing",
        "carrier": "UPS",
        "tracking_number": None,
        "estimated_delivery": "2026-09-14",
        "amount_usd": 1299.00,
    },
    "ORD-1003": {
        "order_id": "ORD-1003",
        "customer_id": "CUST-003",
        "item": 'Samsung 65" QLED 4K Smart TV (QN65Q80D)',
        "status": "Delivered",
        "carrier": "FedEx",
        "tracking_number": "794644792799",
        "estimated_delivery": "2026-09-02",
        "amount_usd": 1499.00,
    },
    "ORD-1004": {
        "order_id": "ORD-1004",
        "customer_id": "CUST-004",
        "item": "AirPods Pro (2nd Generation, USB-C)",
        "status": "Cancelled",
        "carrier": None,
        "tracking_number": None,
        "estimated_delivery": None,
        "amount_usd": 249.00,
    },
    "ORD-1005": {
        "order_id": "ORD-1005",
        "customer_id": "CUST-005",
        "item": 'iPad Pro 12.9" M4 (256GB, Space Black, Wi-Fi)',
        "status": "Delayed",
        "carrier": "UPS",
        "tracking_number": "1Z999AA10123456784",
        "estimated_delivery": "2026-09-18",
        "amount_usd": 1099.00,
    },
    "ORD-1006": {
        "order_id": "ORD-1006",
        "customer_id": "CUST-006",
        "item": "Dell XPS 15 9530 Laptop (RTX 4060, 32GB RAM)",
        "status": "Processing",
        "carrier": "FedEx",
        "tracking_number": None,
        "estimated_delivery": "2026-09-12",
        "amount_usd": 1899.00,
    },
    "ORD-1007": {
        "order_id": "ORD-1007",
        "customer_id": "CUST-007",
        "item": "Sony Alpha A7 IV Mirrorless Camera + 28-70mm Lens Kit",
        "status": "Shipped",
        "carrier": "DHL",
        "tracking_number": "1234567890123",
        "estimated_delivery": "2026-09-09",
        "amount_usd": 2498.00,
    },
    "ORD-1008": {
        "order_id": "ORD-1008",
        "customer_id": "CUST-008",
        "item": 'Kindle Paperwhite (16GB, 7" Display, Waterproof)',
        "status": "Delivered",
        "carrier": "USPS",
        "tracking_number": "9400111899223397614982",
        "estimated_delivery": "2026-09-04",
        "amount_usd": 149.99,
    },
    "ORD-1009": {
        "order_id": "ORD-1009",
        "customer_id": "CUST-009",
        "item": "Apple Watch Series 10 (46mm, GPS, Jet Black Aluminum)",
        "status": "Shipped",
        "carrier": "UPS",
        "tracking_number": "1Z999AA10123456785",
        "estimated_delivery": "2026-09-08",
        "amount_usd": 429.00,
    },
    "ORD-1010": {
        "order_id": "ORD-1010",
        "customer_id": "CUST-010",
        "item": "Dyson V15 Detect Absolute Cordless Vacuum",
        "status": "Processing",
        "carrier": "FedEx",
        "tracking_number": None,
        "estimated_delivery": "2026-09-15",
        "amount_usd": 749.99,
    },
}

ESCALATION_AGENTS = [
    {"agent_id": "AGT-101", "name": "Sophie Turner", "department": "Senior Support"},
    {"agent_id": "AGT-102", "name": "Marcus Reed", "department": "Billing Specialist"},
    {"agent_id": "AGT-103", "name": "Priya Sharma", "department": "Technical Expert"},
    {"agent_id": "AGT-104", "name": "Carlos Vega", "department": "Enterprise Support"},
    {"agent_id": "AGT-105", "name": "Rachel Kim", "department": "Customer Success"},
]

PRIORITY_ETA = {
    "HIGH": "2 business hours",
    "MEDIUM": "24 business hours",
    "LOW": "72 business hours",
}

_ticket_counter = itertools.count(start=5001)
CREATED_TICKETS: dict = {}


def _compute_health(customer: dict) -> str:
    status = customer["account_status"]
    balance = customer["balance_usd"]
    if status == "Locked":
        return "Suspended"
    if status == "Overdue":
        return "At Risk"
    if status == "Pending Cancellation":
        return "Churning"
    if balance < 0:
        return "Fair"
    if balance > 0:
        return "Excellent"
    return "Good Standing"


def lookup_order(order_id: str) -> dict:
    order = ORDERS.get(order_id.upper())
    if not order:
        return {"error": "Order not found", "order_id": order_id}
    result = {k: v for k, v in order.items() if k != "customer_id"}
    return result


def get_account_status(customer_id: str) -> dict:
    customer = CUSTOMERS.get(customer_id)
    if not customer:
        return {"error": "Customer not found", "customer_id": customer_id}
    return {
        "customer_id": customer_id,
        "name": customer["name"],
        "plan": customer["plan"],
        "account_status": customer["account_status"],
        "balance_usd": customer["balance_usd"],
        "account_health": _compute_health(customer),
        "member_since": customer["member_since"],
        "recent_order_ids": customer["recent_order_ids"],
    }


def create_ticket(issue: str, priority: str) -> dict:
    priority = priority.upper()
    if priority not in PRIORITY_ETA:
        priority = "MEDIUM"
    ticket_id = f"TKT-{next(_ticket_counter)}"
    ticket = {
        "ticket_id": ticket_id,
        "issue": issue,
        "priority": priority,
        "eta": PRIORITY_ETA[priority],
        "status": "Open",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    CREATED_TICKETS[ticket_id] = ticket
    return ticket


def escalate_to_human(reason: str) -> dict:
    agent = random.choice(ESCALATION_AGENTS)
    return {
        "escalated": True,
        "reason": reason,
        "agent": agent,
        "estimated_wait_minutes": random.choice([3, 5, 7, 10]),
        "case_id": f"ESC-{uuid.uuid4().hex[:8].upper()}",
    }


def execute_tool(name: str, args: dict, customer_id: str) -> dict:
    if name == "lookup_order":
        return lookup_order(args.get("order_id", ""))
    if name == "get_account_status":
        return get_account_status(customer_id)
    if name == "create_ticket":
        return create_ticket(args.get("issue", ""), args.get("priority", "MEDIUM"))
    if name == "escalate_to_human":
        return escalate_to_human(args.get("reason", "Customer requested human agent"))
    return {"error": f"Unknown tool: {name}"}


def get_gemini_tool_declarations() -> list:
    return [
        types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name="lookup_order",
                    description="Look up the status and details of a customer order by its order ID.",
                    parameters=types.Schema(
                        type="OBJECT",
                        properties={
                            "order_id": types.Schema(
                                type="STRING",
                                description="The order ID to look up, e.g. ORD-1001",
                            )
                        },
                        required=["order_id"],
                    ),
                ),
                types.FunctionDeclaration(
                    name="get_account_status",
                    description="Retrieve the customer's account information, plan details, balance, and account health.",
                    parameters=types.Schema(
                        type="OBJECT",
                        properties={
                            "customer_id": types.Schema(
                                type="STRING",
                                description="The customer ID, e.g. CUST-001",
                            )
                        },
                        required=["customer_id"],
                    ),
                ),
                types.FunctionDeclaration(
                    name="create_ticket",
                    description="Create a support ticket for an issue that cannot be immediately resolved.",
                    parameters=types.Schema(
                        type="OBJECT",
                        properties={
                            "issue": types.Schema(
                                type="STRING",
                                description="A clear description of the customer's issue",
                            ),
                            "priority": types.Schema(
                                type="STRING",
                                description="Priority level: HIGH, MEDIUM, or LOW",
                            ),
                        },
                        required=["issue", "priority"],
                    ),
                ),
                types.FunctionDeclaration(
                    name="escalate_to_human",
                    description="Escalate the conversation to a human support agent. Use only for disputes over $500, legal requests, or when the customer explicitly demands human assistance.",
                    parameters=types.Schema(
                        type="OBJECT",
                        properties={
                            "reason": types.Schema(
                                type="STRING",
                                description="The reason for escalating to a human agent",
                            )
                        },
                        required=["reason"],
                    ),
                ),
            ]
        )
    ]
