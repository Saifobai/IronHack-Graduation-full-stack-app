# routes/highlight_routes.py
from fastapi import APIRouter
from models.video_request import VideoRequest
from controllers.highlight_controller import extract_highlights

router = APIRouter()


@router.post("/")
async def highlights_route(req: VideoRequest):
    return await extract_highlights(req)
