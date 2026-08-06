import os, json, subprocess
from .whisper_utils import download_youtube_audio, transcribe_file
from .youtube_captions import extract_video_id, get_youtube_captions
from .video_utils import download_video
from .gpt_utils import summarize_transcript, ask_gpt_for_viral_moments
from .memory import store_context, retrieve_context
from .rlhf import store_interaction
from .video_clipper import cut_clip
from langsmith import traceable

STORAGE_TRANSCRIPTS = os.path.join(os.getcwd(), "storage", "transcripts")
STORAGE_AUDIO = os.path.join(os.getcwd(), "storage", "audio")
os.makedirs(STORAGE_TRANSCRIPTS, exist_ok=True)
os.makedirs(STORAGE_AUDIO, exist_ok=True)


@traceable(name="pipeline_core")
def pipeline_core(video_url=None, video_file=None, task="Summarize"):
    """
    Unified pipeline:
    - Transcript / Summarize / Highlights → YouTube captions first, Whisper fallback
    - Viral → full video + audio, always Whisper (needs real timestamps)
    """
    captions_used = False

    # --- 1. Download / Prepare video or audio ---
    if video_file:
        fpath = video_file
        video_id = os.path.splitext(os.path.basename(video_file))[0]

        audio_path = os.path.join(STORAGE_AUDIO, f"{video_id}.m4a")
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", fpath, "-vn", "-acodec", "aac", audio_path],
                check=True,
            )
            transcribe_target = audio_path
        except Exception as e:
            return {"error": f"ffmpeg audio extraction failed: {e}"}, {}

    elif video_url:
        if "youtube.com" in video_url or "youtu.be" in video_url:
            if task == "Viral":
                fpath, video_id = download_video(video_url)
                audio_path = os.path.join(STORAGE_AUDIO, f"{video_id}.m4a")
                try:
                    subprocess.run(
                        [
                            "ffmpeg",
                            "-y",
                            "-i",
                            fpath,
                            "-vn",
                            "-acodec",
                            "aac",
                            audio_path,
                        ],
                        check=True,
                    )
                    transcribe_target = audio_path
                except Exception as e:
                    return {"error": f"ffmpeg audio extraction failed: {e}"}, {}
            else:
                # 📝 Transcript / Summarize / Highlights → captions first
                video_id = extract_video_id(
                    video_url
                )  # real YouTube ID, consistent across calls
                fpath = None
                transcribe_target = None

                captions = get_youtube_captions(video_id)
                if captions:
                    captions_used = True
                    transcript = captions
                else:
                    transcribe_target = download_youtube_audio(
                        video_url, out_dir=STORAGE_AUDIO
                    )
                    fpath = transcribe_target
        else:
            fpath, video_id = download_video(video_url)
            audio_path = os.path.join(STORAGE_AUDIO, f"{video_id}.m4a")
            try:
                subprocess.run(
                    ["ffmpeg", "-y", "-i", fpath, "-vn", "-acodec", "aac", audio_path],
                    check=True,
                )
                transcribe_target = audio_path
            except Exception as e:
                return {"error": f"ffmpeg audio extraction failed: {e}"}, {}
    else:
        raise ValueError("No video_url or video_file provided")

    # --- 2. Transcribe (skip entirely if captions already gave us text) ---
    if not captions_used:
        try:
            transcript, segments = transcribe_file(transcribe_target)
        except Exception as e:
            return {"error": f"Transcription failed: {e}"}, {"video_id": video_id}
    else:
        segments = []  # captions have no word-level timestamps

    transcript_path = os.path.join(STORAGE_TRANSCRIPTS, f"{video_id}.txt")
    try:
        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(transcript)
    except Exception as e:
        print(f"⚠️ Could not save transcript file: {e}")

    try:
        store_context(video_id, transcript)
    except Exception as e:
        print(f"⚠️ Could not store transcript in memory: {e}")

    # --- 3. Task Router ---
    if task == "Transcript":
        result = {"transcription": transcript}

    elif task == "Summarize":
        try:
            summary = summarize_transcript(transcript)
            if isinstance(summary, dict):
                summary = summary.get("summary", json.dumps(summary))
            summary = str(summary)
            result = {"summary": summary}
        except Exception as e:
            result = {"error": f"Summarization failed: {e}"}

    elif task == "Highlights":
        try:
            highlights = retrieve_context(video_id, query="Extract highlights", k=5)
            result = {"highlights": highlights}
        except Exception as e:
            result = {"error": f"Highlight extraction failed: {e}"}

    elif task == "Viral":
        probe_cmd = [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=codec_type",
            "-of",
            "json",
            fpath,
        ]
        probe_result = subprocess.run(
            probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        has_video = '"codec_type": "video"' in probe_result.stdout

        if not has_video:
            result = {"clips": [], "warning": "Source has no video track (audio-only)."}
        else:
            try:
                viral_segments = ask_gpt_for_viral_moments(
                    transcript, segments, num_clips=3
                )
            except Exception as e:
                print(f"⚠️ GPT viral extraction failed: {e}")
                viral_segments = []

            if not viral_segments:
                viral_segments = [
                    {"title": "viral_clip_1", "start": 0, "end": 15},
                    {"title": "viral_clip_2", "start": 15, "end": 30},
                    {"title": "viral_clip_3", "start": 30, "end": 45},
                ]

            clips = []
            for idx, seg in enumerate(viral_segments, 1):
                try:
                    start, end = seg["start"], seg["end"]
                    title = seg.get("title", f"viral_clip_{idx}")
                    clip_path = cut_clip(fpath, start, end, f"viral_clip_{idx}")
                    clip_url = f"/clips/{os.path.basename(clip_path)}"
                    clips.append(
                        {"title": title, "url": clip_url, "start": start, "end": end}
                    )
                except Exception as e:
                    clips.append({"title": f"viral_clip_{idx}", "error": str(e)})

            result = {"clips": clips}

    else:
        result = {"error": f"Unknown task '{task}'"}

    # --- 4. RLHF Logging ---
    try:
        store_interaction(
            f"{task}:{video_url or video_file}", result, {"video_id": video_id}
        )
    except Exception as e:
        print(f"⚠️ Could not log interaction: {e}")

    return result, {
        "video_id": video_id,
        "transcript": transcript,
        "transcript_path": transcript_path,
    }
