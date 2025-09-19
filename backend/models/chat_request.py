from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    video_id: Optional[str] = None
    # Accept "url" from Node but internally map to video_url
    url: Optional[str] = Field(None, alias="video_url")

    audio_file: Optional[str] = None
    uploaded_file: Optional[str] = None

    class Config:
        populate_by_name = True
