# routes/viral_routes.py
from fastapi import APIRouter
from models.video_request import VideoRequest
from controllers.viral_controller import generate_viral_clips

router = APIRouter()


@router.post("/")
async def viral_route(req: VideoRequest):
    return await generate_viral_clips(req)
