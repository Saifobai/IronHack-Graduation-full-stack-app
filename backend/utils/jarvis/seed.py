# ================================
# SEED: App + Creator Knowledge -> Pinecone (with platform tags)
# Run after STEP 9 (pc, index_name, embeddings, make_id exist)
# ================================
from datetime import datetime
import json
import hashlib
from jarvis.memory import get_pinecone_index, get_embeddings


def make_id(text: str):
    return hashlib.md5(text.encode("utf-8")).hexdigest()


# --- Connect Pinecone + Embeddings --- #
INDEX_NAME = "clipoframeaiapp04"
index = get_pinecone_index(INDEX_NAME)
embeddings = get_embeddings()

NAMESPACES = ["app_info", "facts"]
BATCH_SIZE = 50

# --- 2) Prepare seed content --- #
seed_docs = {
    "about": [
        (
            "ClipoFrameAI is a dark-themed AI web app that transforms long videos into instant summaries, highlights, and Q&A via a chat-style interface.",
            "general",
        ),
        (
            "The product merges chat-driven video understanding with short-form monetization features like auto-clipping for TikTok/Shorts.",
            "general",
        ),
    ],
    "features": [
        ("Dark Theme UI with React + TailwindCSS + Framer Motion.", "general"),
        ("Voice Input using Whisper for speech-to-text transcription.", "general"),
        (
            "Embedded YouTube player with clickable highlights and timestamps.",
            "general",
        ),
        (
            "Chat-style QA interface to ask natural language questions about any video.",
            "general",
        ),
        (
            "Multilingual support and RAG-powered retrieval (LangChain + Pinecone/Chroma).",
            "general",
        ),
        (
            "Auto-clipping mode to export short clips for TikTok/YouTube Shorts.",
            "general",
        ),
        (
            "Built-in assistant to guide users on usage, content ideas, and app features.",
            "general",
        ),
    ],
    "how_to_use": [
        (
            "Paste a YouTube link into the pipeline (or upload a file) and choose a task: Transcript, Summarize, Highlights, Q&A, or Viral Captions.",
            "general",
        ),
        (
            "After the pipeline runs, switch to the Jarvis Chat tab and ask 'Summarize this' or ask any question about the processed video.",
            "general",
        ),
        (
            "To process private videos, provide an up-to-date cookies.txt file and use refresh_cookies() when the cookie expires.",
            "general",
        ),
    ],
    "getting_started": [
        (
            "Frontend: cd frontend && npm install && npm run dev (default host: http://localhost:5173).",
            "general",
        ),
        (
            "Backend: cd backend && pip install -r requirements.txt && uvicorn app:app --reload (default host: http://localhost:8000).",
            "general",
        ),
    ],
    "tech_stack": [
        ("Frontend: React + Vite + TailwindCSS + Framer Motion.", "general"),
        ("Backend: FastAPI, LangChain, Whisper, OpenAI/HuggingFace LLMs.", "general"),
        (
            "Vector DB: Pinecone (serverless) or Chroma; embeddings from OpenAI text-embedding-3-small.",
            "general",
        ),
    ],
    "project_structure": [
        (
            "project/frontend — React app with components, pages, and services.",
            "general",
        ),
        (
            "project/backend — FastAPI server with rag_pipeline.py, youtube_utils.py, app.py and requirements.txt.",
            "general",
        ),
    ],
    "ui_flow": [
        (
            "Before login: hero section with paste link CTA, demo preview and signup/promo.",
            "general",
        ),
        (
            "After login: Dashboard with embedded player + timeline highlights + chat assistant sidebar.",
            "general",
        ),
    ],
    "pricing": [
        (
            "Free Tier: limited features and duration (e.g., 10-min summaries + basic chat).",
            "general",
        ),
        (
            "Pro Tier: unlimited length, quiz mode, batch processing, auto-clips for TikTok/Shorts (e.g., $10/month).",
            "general",
        ),
    ],
    "monetization": [
        ("Free tier to attract users; Pro subscriptions for power users.", "general"),
        (
            "Creator growth: share templates & captions; in-app viral content to drive ad revenue.",
            "general",
        ),
    ],
    "faq": [
        (
            "Q: How do I get highlights? A: Run the pipeline with the Highlights task or ask Jarvis 'Show highlights' after processing a video.",
            "general",
        ),
        (
            "Q: How to use private videos? A: Upload a fresh cookies.txt and use refresh_cookies('cookies.txt') in Colab to allow yt-dlp access.",
            "general",
        ),
    ],
    "troubleshooting": [
        (
            "If Whisper import fails due to numba/numpy version issues, install openai-whisper and a compatible numba/numpy.",
            "general",
        ),
        (
            "If yt-dlp fails with Login required, refresh your cookies.txt and run refresh_cookies() in the notebook.",
            "general",
        ),
        (
            "If Pinecone upserts fail, ensure PINECONE_API_KEY env var is set and pc client was created.",
            "general",
        ),
    ],
    "developer_notes": [
        (
            "Keep 'memory = MemoryManager(index_name, embeddings)' in your notebook so tools can use the MemoryManager wrapper.",
            "general",
        ),
        (
            "Keep a consistent 'index_name' (clipoframeaiapp04) across all cells — it's used by pc.Index(index_name).",
            "general",
        ),
        (
            "Seeding uses stable ids (md5) so re-running will update existing entries rather than duplicate them.",
            "general",
        ),
    ],
    # --- NEW: Creator Tips ---
    "creator_tips": [
        (
            "For TikTok/Reels/Shorts: Keep videos between 15-30 seconds for virality. Start with a strong hook in the first 3 seconds.",
            "tiktok",
        ),
        (
            "Always use captions and bold text overlays in short-form videos. Most users watch muted.",
            "general",
        ),
        (
            "TikTok/Reels/Shorts should be vertical 9:16 (1080x1920). Post 2-3 clips daily for fast growth.",
            "tiktok",
        ),
        (
            "On YouTube, 8–12 minutes works best for monetization. Structure: Hook → Story → Payoff → Call to Action.",
            "youtube",
        ),
        (
            "Use YouTube Shorts to funnel viewers into your full videos. Pair Shorts with strong titles and thumbnails.",
            "youtube",
        ),
        (
            "On Instagram Reels, keep it under 60 seconds. Add engaging captions and trending sounds for better reach.",
            "instagram",
        ),
        (
            "Collaborations on Instagram (tagging other creators) helps reach new audiences faster.",
            "instagram",
        ),
        (
            "Best content types: Educational nuggets, reaction clips, behind-the-scenes, storytelling, and listicles.",
            "general",
        ),
        (
            "Growth hack: Repurpose one long video into 10+ short clips for TikTok, Reels, and Shorts.",
            "general",
        ),
        (
            "Use AI captions with emojis and bold keywords to increase retention.",
            "general",
        ),
        (
            "Always end videos with a strong CTA: follow, subscribe, or comment.",
            "general",
        ),
        (
            "Engage with comments within the first hour of posting to boost algorithm visibility.",
            "general",
        ),
        (
            "Cross-post content across TikTok, Instagram Reels, YouTube Shorts, and Twitter for maximum reach.",
            "general",
        ),
    ],
    # --- NEW: Monetization Tips ---
    "monetization_tips": [
        (
            "TikTok Creator Fund pays per view but limited. Better monetization comes from brand deals and UGC content.",
            "tiktok",
        ),
        (
            "YouTube Partner Program monetizes long-form content. Focus on audience retention and watch time.",
            "youtube",
        ),
        (
            "Creators can monetize by selling digital products like courses, templates, and presets.",
            "general",
        ),
        (
            "Brand collaborations and sponsorships are often more lucrative than ad revenue.",
            "general",
        ),
        (
            "Affiliate marketing is an effective way to monetize audiences across platforms.",
            "general",
        ),
    ],
}

# --- Flatten --- #
items = []
for category, texts in seed_docs.items():
    for t, platform in texts:
        uid = make_id(f"{category}|{t[:300]}")
        md = {
            "source": "seed",
            "category": category,
            "platform": platform,
            "text": t,
            "date": datetime.utcnow().isoformat(),
        }
        items.append({"id": uid, "text": t, "metadata": md})

# --- Embed --- #
texts = [it["text"] for it in items]
vectors = embeddings.embed_documents(texts)

payloads = [
    {"id": it["id"], "values": vectors[i], "metadata": it["metadata"]}
    for i, it in enumerate(items)
]

# --- Upsert --- #
print(f"[seed] Prepared {len(payloads)} payloads. Upserting...")
for ns in NAMESPACES:
    for i in range(0, len(payloads), BATCH_SIZE):
        batch = payloads[i : i + BATCH_SIZE]
        index.upsert(batch, namespace=ns)
    print(f"[seed] Upserted {len(payloads)} docs under namespace={ns}")

# --- Save JSONL snapshot --- #
with open("app_seeded_docs.jsonl", "w", encoding="utf-8") as fout:
    for p in payloads:
        fout.write(json.dumps(p["metadata"], ensure_ascii=False) + "\n")

print(
    "✅ Seeding complete. Jarvis can now recall app info + creator/monetization tips with platform tags."
)
