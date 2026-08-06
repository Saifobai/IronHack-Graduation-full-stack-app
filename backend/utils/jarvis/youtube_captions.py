from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")
    return parse_qs(parsed.query)["v"][0]


def get_youtube_captions(video_id: str) -> str | None:
    """Try to fetch existing YouTube captions. Returns None if unavailable."""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(chunk["text"] for chunk in transcript)
    except (TranscriptsDisabled, NoTranscriptFound):
        return None
    except Exception:
        return None