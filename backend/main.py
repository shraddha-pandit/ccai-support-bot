import logging
import traceback

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import BACKEND_HOST, BACKEND_PORT, CORS_ORIGINS
from customers import list_customers
from gemini_agent import run_agent_loop
from models import ChatRequest, ChatResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ccai")

app = FastAPI(title="CCAI Support Bot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/customers")
async def get_customers():
    return {"customers": list_customers()}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    logger.info("POST /chat | customer=%s | message=%r", request.customer_id, request.message[:120])
    try:
        result = await run_agent_loop(
            request.message,
            request.customer_id,
            request.conversation_history,
        )
        logger.info(
            "Chat OK | tools=%s | csat=%.1f | escalated=%s",
            result["tools_called"],
            result["csat_score"],
            result["escalated"],
        )
        return ChatResponse(**result)
    except Exception as e:
        logger.error("Chat FAILED:\n%s", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)
