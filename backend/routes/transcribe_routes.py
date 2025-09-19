# routes/transcribe_routes.py
from fastapi import APIRouter
from models.video_request import VideoRequest
from controllers.transcribe_controller import transcribe_video

router = APIRouter()


@router.post("/")
async def transcribe_route(req: VideoRequest):
    return await transcribe_video(req)
