from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from langsmith import Client

from routes.summarize_routes import router as summarize_router
from routes.highlight_routes import router as highlight_router
from routes.transcribe_routes import router as transcribe_router
from routes.viral_routes import router as viral_router
from routes.chat_routes import router as chat_router

# ==========================
# Load env & setup LangSmith
# ==========================


app = FastAPI(title="ClipoFrameAI Backend", version="1.0")


if os.getenv("LANGCHAIN_API_KEY"):
    client = Client()
    print(f"✅ LangSmith enabled. Project: {os.getenv('LANGCHAIN_PROJECT', 'default')}")
else:
    print("⚠️ LangSmith disabled (no LANGCHAIN_API_KEY found)")

app.mount("/clips", StaticFiles(directory="storage/clips"), name="clips")


# ==========================
# Middleware
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # adjust for frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Register Routes
# ==========================
app.include_router(summarize_router, prefix="/summarize", tags=["Summarize"])
app.include_router(highlight_router, prefix="/highlights", tags=["Highlights"])
app.include_router(transcribe_router, prefix="/transcribe", tags=["Transcription"])
app.include_router(viral_router, prefix="/viral", tags=["Viral Clips"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
