import os, uuid, subprocess

VIDEOS_DIR = os.path.join(os.getcwd(), "storage", "videos")
os.makedirs(VIDEOS_DIR, exist_ok=True)


def download_video(url: str):
    """
    Download full MP4 video+audio (so ffmpeg/whisper won't fail).
    Returns (path, video_id).
    """
    video_id = str(uuid.uuid4())[:8]
    output_path = os.path.join(VIDEOS_DIR, f"{video_id}.mp4")

    cmd = [
        "yt-dlp",
        "-f",
        "mp4",  # ✅ force proper MP4 mux
        "-o",
        output_path,
        url,
    ]
    subprocess.run(cmd, check=True)

    return output_path, video_id
