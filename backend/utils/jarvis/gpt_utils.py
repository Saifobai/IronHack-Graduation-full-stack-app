from dotenv import load_dotenv
from openai import OpenAI
import os, json

from langsmith import traceable

load_dotenv()

# ✅ Safer get
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("❌ OPENAI_API_KEY not found. Did you set it in .env?")

client = OpenAI(api_key=OPENAI_API_KEY)


def gpt_chat(
    prompt,
    system="You are a helpful assistant.",
    max_tokens=600,
    temperature=0.2,
    model_name="gpt-4o-mini",
):
    resp = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return resp.choices[0].message.content


@traceable(name="summarize_transcript")
def summarize_transcript(transcript: str):
    return gpt_chat(f"Summarize this:\n\n{transcript}", system="You are a summarizer.")


@traceable(name="generate_viral_ideas")
def generate_viral_ideas(transcript: str):
    return gpt_chat(
        f"Suggest 3 viral clip ideas from this transcript:\n\n{transcript}",
        system="You are a viral content assistant.",
    )


@traceable(name="ask_gpt_for_viral_moments")
def ask_gpt_for_viral_moments(transcript: str, segments=None, num_clips=3):
    """
    Ask GPT to return structured JSON with viral-worthy segments.
    Each object must have: title, start, end (seconds).
    """

    prompt = f"""
    You are an expert viral video editor like OpusClip AI.

    Based on this transcript, select {num_clips} viral-worthy moments.
    Each clip should be 15–30 seconds long, start and end at natural speech boundaries.

    Transcript:
    {transcript}

    Return JSON in this exact format:
    [
      {{"title": "Funny Argument", "start": 45, "end": 65}},
      {{"title": "Shocking Reveal", "start": 120, "end": 145}},
      {{"title": "Best Quote", "start": 200, "end": 225}}
    ]
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )

    content = response.choices[0].message.content

    try:
        clips = json.loads(content)
        return clips
    except Exception:
        # fallback: empty list if parsing fails
        return []
