from fastapi import APIRouter
from models.video_request import VideoRequest
from controllers.summarize_controller import summarize_video

router = APIRouter()


@router.post("/")
async def summarize(req: VideoRequest):
    return await summarize_video(req)
