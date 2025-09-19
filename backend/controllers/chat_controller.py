# controllers/chat_controller.py
from fastapi import HTTPException
from models.chat_request import ChatRequest
from utils.jarvis.agent import jarvis_entry_core
from utils.jarvis.pipeline import pipeline_core

from langsmith import traceable


@traceable(name="chat_with_jarvis")
async def chat_with_jarvis(req: ChatRequest):
    print("🔥 DEBUG ChatRequest:", req.dict())
    if not req.message:
        raise HTTPException(status_code=400, detail="Message is required")

    context = {}

    if req.url:  # ✅ now matches JS payload { url: videoUrl }
        try:
            print(f"📥 Received video url: {req.url}")  # DEBUG
            result, ctx = pipeline_core(video_url=req.url, task="Transcript")
            print(f"✅ Transcript saved at: {ctx['transcript_path']}")  # DEBUG

            context["video_id"] = ctx["video_id"]
            context["transcript"] = result
            context["transcript_path"] = ctx["transcript_path"]

        except Exception as e:
            print(f"❌ Pipeline error: {e}")  # DEBUG
            raise HTTPException(
                status_code=500, detail=f"Failed to process video: {str(e)}"
            )

    elif req.video_id:
        print(f"📂 Using existing video_id: {req.video_id}")  # DEBUG
        context["video_id"] = req.video_id
    else:
        print("💬 General chat (no video)")  # DEBUG

    try:
        response = jarvis_entry_core(
            user_text=req.message,
            audio_file=req.audio_file,
            uploaded_file=req.uploaded_file,
            context=context,
        )
        print(f"🤖 Agent response: {response}")  # DEBUG
        return {"response": response}
    except Exception as e:
        print(f"🔥 Jarvis error: {e}")  # DEBUG
        raise HTTPException(status_code=500, detail=f"Jarvis error: {str(e)}")
