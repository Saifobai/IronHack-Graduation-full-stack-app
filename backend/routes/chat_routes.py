from fastapi import APIRouter
from models.chat_request import ChatRequest
from controllers.chat_controller import chat_with_jarvis

router = APIRouter()


@router.post("/")
async def chat(req: ChatRequest):
    """
    Main Jarvis chat route.
    Frontend sends a message, optionally with video_id (context).
    """
    return await chat_with_jarvis(req)
