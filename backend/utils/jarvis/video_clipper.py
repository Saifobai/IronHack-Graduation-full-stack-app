import os
import subprocess
import uuid

# Ensure clips folder exists
CLIPS_DIR = os.path.join(os.getcwd(), "storage", "clips")
os.makedirs(CLIPS_DIR, exist_ok=True)


def cut_clip(input_path: str, start: float, end: float, title: str = "clip") -> str:
    """
    Cut a subclip from input_path between start and end seconds.
    Always re-encodes with H.264 (video) + AAC (audio) for compatibility.
    Returns the saved file path.
    """
    clip_id = str(uuid.uuid4())[:8]
    safe_title = title.replace(" ", "_").lower()
    output_path = os.path.join(CLIPS_DIR, f"{safe_title}_{clip_id}.mp4")

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_path,
        "-ss",
        str(start),
        "-to",
        str(end),
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-preset",
        "fast",
        "-crf",
        "23",
        output_path,
    ]

    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return output_path
