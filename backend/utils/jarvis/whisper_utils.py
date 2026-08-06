from faster_whisper import WhisperModel
import subprocess, os, uuid
import os
import uuid
# Load the model once at startup
WHISPER_MODEL = os.environ.get(
    "WHISPER_MODEL", "base"
)  # tiny, base, small, medium, large-v2
DEVICE = "cuda" if os.environ.get("USE_GPU", "1") == "1" else "cpu"
COMPUTE_TYPE = "float16" if DEVICE == "cuda" else "int8"

whisper_model = WhisperModel(WHISPER_MODEL, device=DEVICE, compute_type=COMPUTE_TYPE)


def download_youtube_audio(url, out_dir="storage/audio"):
    os.makedirs(out_dir, exist_ok=True)
    unique_id = str(uuid.uuid4())[:8]
    out_path = os.path.join(out_dir, f"yt_{unique_id}.m4a")

    cmd = [
    "yt-dlp",
    "-f", "bestaudio/best",
    "--extract-audio",
    "--audio-format", "m4a",
    "--no-playlist",
    "--extractor-args", "youtube:player_client=android_vr",
    "-o", out_path,
    url,
]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        # this is the part your current code throws away
        raise RuntimeError(f"yt-dlp failed for {url}:\n{result.stderr.strip()}")

    if not os.path.exists(out_path):
        raise RuntimeError(
            f"yt-dlp exited 0 but no file at {out_path} — check ffmpeg is installed and on PATH"
        )

    return out_path

def transcribe_file(file_path, language=None):
    """
    Transcribe audio with faster-whisper.
    Returns (text, segments).
    """
    segments_gen, info = whisper_model.transcribe(file_path, beam_size=5, language=language)

    segs = []
    text_parts = []
    for seg in segments_gen:            # iterate ONCE — faster-whisper's generator is one-shot
        text_parts.append(seg.text)
        segs.append({"start": seg.start, "end": seg.end, "text": seg.text})

    text = " ".join(text_parts)
    return text, segs
