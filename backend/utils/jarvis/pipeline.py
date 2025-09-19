# import os, json, subprocess
# from .whisper_utils import download_youtube_audio, transcribe_file
# from .video_utils import download_video
# from .gpt_utils import summarize_transcript, ask_gpt_for_viral_moments
# from .memory import store_context, retrieve_context
# from .rlhf import store_interaction
# from .video_clipper import cut_clip
# from langsmith import traceable

# STORAGE_TRANSCRIPTS = os.path.join(os.getcwd(), "storage", "transcripts")
# STORAGE_AUDIO = os.path.join(os.getcwd(), "storage", "audio")
# os.makedirs(STORAGE_TRANSCRIPTS, exist_ok=True)
# os.makedirs(STORAGE_AUDIO, exist_ok=True)


# @traceable(name="pipeline_core")
# def pipeline_core(video_url=None, video_file=None, task="Summarize"):
#     """
#     Unified pipeline:
#     - Summarize / Transcript / Highlights → audio only
#     - Viral → video + extracted audio for transcription
#     """

#     # --- 1. Download / Prepare video or audio ---
#     if video_file:
#         fpath = video_file
#         video_id = os.path.splitext(os.path.basename(video_file))[0]

#     elif video_url:
#         if "youtube.com" in video_url or "youtu.be" in video_url:
#             if task == "Viral":
#                 # 🔥 Full video for viral clipping
#                 fpath, video_id = download_video(video_url)

#                 # 🎤 Extract audio for transcription
#                 audio_path = os.path.join(STORAGE_AUDIO, f"{video_id}.m4a")
#                 subprocess.run(
#                     ["ffmpeg", "-y", "-i", fpath, "-vn", "-acodec", "aac", audio_path],
#                     check=True,
#                 )
#                 transcribe_target = audio_path
#             else:
#                 # 📝 audio-only for transcript/summarize
#                 transcribe_target = download_youtube_audio(
#                     video_url, out_dir=STORAGE_AUDIO
#                 )
#                 video_id = os.path.splitext(os.path.basename(transcribe_target))[0]
#                 fpath = transcribe_target
#         else:
#             # Direct mp4 URL
#             fpath, video_id = download_video(video_url)

#             # 🎤 Extract audio
#             audio_path = os.path.join(STORAGE_AUDIO, f"{video_id}.m4a")
#             subprocess.run(
#                 ["ffmpeg", "-y", "-i", fpath, "-vn", "-c:a", "aac", audio_path],
#                 check=True,
#             )
#             transcribe_target = audio_path
#     else:
#         raise ValueError("No video_url or video_file provided")

#     # --- 2. Transcribe (always on audio) ---
#     transcript, segments = transcribe_file(transcribe_target)

#     # Save transcript
#     transcript_path = os.path.join(STORAGE_TRANSCRIPTS, f"{video_id}.txt")
#     with open(transcript_path, "w", encoding="utf-8") as f:
#         f.write(transcript)

#     # Store in vector DB memory
#     store_context(video_id, transcript)

#     # --- 3. Task Router ---
#     if task == "Transcript":
#         result = {"transcription": transcript}

#     elif task == "Summarize":
#         result = {"summary": summarize_transcript(transcript)}

#     elif task == "Highlights":
#         result = {
#             "highlights": retrieve_context(video_id, query="Extract highlights", k=5)
#         }

#     elif task == "Viral":
#         # ✅ Check video stream exists
#         probe_cmd = [
#             "ffprobe",
#             "-v",
#             "error",
#             "-select_streams",
#             "v:0",
#             "-show_entries",
#             "stream=codec_type",
#             "-of",
#             "json",
#             fpath,
#         ]
#         probe_result = subprocess.run(
#             probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
#         )
#         has_video = '"codec_type": "video"' in probe_result.stdout

#         if not has_video:
#             result = {"clips": [], "warning": "Source has no video track (audio-only)."}
#         else:
#             # 🔥 Ask GPT for viral-worthy segments
#             viral_segments = ask_gpt_for_viral_moments(
#                 transcript, segments, num_clips=3
#             )

#             # ⛑ fallback if GPT fails
#             if not viral_segments:
#                 viral_segments = [
#                     {"title": "viral_clip_1", "start": 0, "end": 15},
#                     {"title": "viral_clip_2", "start": 15, "end": 30},
#                     {"title": "viral_clip_3", "start": 30, "end": 45},
#                 ]

#             clips = []
#             for idx, seg in enumerate(viral_segments, 1):
#                 try:
#                     start, end = seg["start"], seg["end"]
#                     title = seg.get("title", f"viral_clip_{idx}")
#                     clip_path = cut_clip(fpath, start, end, f"viral_clip_{idx}")
#                     clip_url = f"/clips/{os.path.basename(clip_path)}"
#                     clips.append(
#                         {"title": title, "url": clip_url, "start": start, "end": end}
#                     )
#                 except Exception as e:
#                     clips.append({"title": f"viral_clip_{idx}", "error": str(e)})

#             result = {"clips": clips}

#     else:
#         result = {"error": "Unknown task"}

#     # --- 4. RLHF Logging ---
#     store_interaction(
#         f"{task}:{video_url or video_file}", result, {"video_id": video_id}
#     )

#     return result, {
#         "video_id": video_id,
#         "transcript": transcript,
#         "transcript_path": transcript_path,
#     }


# ===============================================

import os, json, subprocess
from .whisper_utils import download_youtube_audio, transcribe_file
from .video_utils import download_video
from .gpt_utils import summarize_transcript, ask_gpt_for_viral_moments
from .memory import store_context, retrieve_context
from .rlhf import store_interaction
from .video_clipper import cut_clip
from langsmith import traceable

# === Storage directories ===
STORAGE_TRANSCRIPTS = os.path.join(os.getcwd(), "storage", "transcripts")
STORAGE_AUDIO = os.path.join(os.getcwd(), "storage", "audio")
os.makedirs(STORAGE_TRANSCRIPTS, exist_ok=True)
os.makedirs(STORAGE_AUDIO, exist_ok=True)


@traceable(name="pipeline_core")
def pipeline_core(video_url=None, video_file=None, task="Summarize"):
    """
    Unified pipeline:
    - Transcript / Summarize / Highlights → audio-only
    - Viral → full video + audio for transcription
    """

    # --- 1. Download / Prepare video or audio ---
    if video_file:
        fpath = video_file
        video_id = os.path.splitext(os.path.basename(video_file))[0]

        # 🎤 Extract audio for transcription
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
                # 🔥 Download full video for viral clipping
                fpath, video_id = download_video(video_url)

                # 🎤 Extract audio
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
                # 📝 Audio-only for transcript/summarize
                transcribe_target = download_youtube_audio(
                    video_url, out_dir=STORAGE_AUDIO
                )
                video_id = os.path.splitext(os.path.basename(transcribe_target))[0]
                fpath = transcribe_target
        else:
            # Direct video URL (mp4, etc.)
            fpath, video_id = download_video(video_url)

            # 🎤 Extract audio
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

    # --- 2. Transcribe (always on audio) ---
    try:
        transcript, segments = transcribe_file(transcribe_target)
    except Exception as e:
        return {"error": f"Transcription failed: {e}"}, {"video_id": video_id}

    # Save transcript to disk
    transcript_path = os.path.join(STORAGE_TRANSCRIPTS, f"{video_id}.txt")
    try:
        with open(transcript_path, "w", encoding="utf-8") as f:
            f.write(transcript)
    except Exception as e:
        print(f"⚠️ Could not save transcript file: {e}")

    # Store in vector DB memory
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
            # 🔒 Ensure it's a string
            if isinstance(summary, dict):
                # if nested like {"summary": "blah"}
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
        # ✅ Check if video has a stream
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

            # fallback if GPT fails
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
            f"{task}:{video_url or video_file}",
            result,
            {"video_id": video_id},
        )
    except Exception as e:
        print(f"⚠️ Could not log interaction: {e}")

    return result, {
        "video_id": video_id,
        "transcript": transcript,
        "transcript_path": transcript_path,
    }
