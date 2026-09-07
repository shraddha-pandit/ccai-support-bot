import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = "gemini-3.6-flash"
MAX_TOOL_ITERATIONS = 6
MAX_HISTORY_TURNS = 10
BACKEND_HOST = "0.0.0.0"
BACKEND_PORT = 8000
CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
