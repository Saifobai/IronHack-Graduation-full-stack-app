from faster_whisper import WhisperModel
import subprocess, os, uuid

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
        "-f",
        "bestaudio",
        "--extract-audio",
        "--audio-format",
        "m4a",  # ✅ safe for whisper
        "-o",
        out_path,
        url,
    ]
    subprocess.run(cmd, check=True)
    return out_path


def transcribe_file(file_path, language=None):
    """
    Transcribe audio with faster-whisper.
    Returns (text, segments).
    """
    segments, info = whisper_model.transcribe(file_path, beam_size=5, language=language)

    text = " ".join([seg.text for seg in segments])
    segs = [{"start": seg.start, "end": seg.end, "text": seg.text} for seg in segments]

    return text, segs
