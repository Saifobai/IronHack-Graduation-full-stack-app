# controllers/transcribe_controller.py
from fastapi import HTTPException
from models.video_request import VideoRequest
from utils.jarvis.pipeline import pipeline_core
from utils.jarvis.video_utils import download_video
import os


async def transcribe_video(req: VideoRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="Video URL is required")

    # Download video → save to storage/videos/ → get file path + video_id
    file_path, video_id = download_video(req.url)

    # Run transcription via pipeline
    result, _ = pipeline_core(
        video_file=file_path, video_url=req.url, task="Transcript"
    )

    # Save transcript in storage/transcripts/
    transcript_dir = os.path.join("storage", "transcripts")
    os.makedirs(transcript_dir, exist_ok=True)

    transcript_path = os.path.join(transcript_dir, f"{video_id}.txt")
    with open(transcript_path, "w", encoding="utf-8") as f:
        f.write(result)

    return {"video_id": video_id, "transcription": result}
