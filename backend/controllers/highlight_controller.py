from fastapi import HTTPException
from models.video_request import VideoRequest
from utils.jarvis.pipeline import pipeline_core


async def extract_highlights(req: VideoRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="Video URL is required")

    result, _ = pipeline_core(
        video_file=req.file_path, video_url=req.url, task="Highlights"
    )
    return {"highlights": result}
