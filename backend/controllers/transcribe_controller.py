from fastapi import HTTPException
from models.video_request import VideoRequest
from utils.jarvis.pipeline import pipeline_core


async def transcribe_video(req: VideoRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="Video URL is required")

    result, meta = pipeline_core(video_url=req.url, task="Transcript")

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {"video_id": meta["video_id"], "transcription": result["transcription"]}