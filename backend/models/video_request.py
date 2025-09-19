from pydantic import BaseModel
from typing import Optional


class VideoRequest(BaseModel):
    url: str
    file_path: Optional[str] = None
