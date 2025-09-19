import os
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool
from langchain.memory import ConversationBufferMemory
from langsmith import traceable

# Import your tools
from .pipeline import pipeline_core
from .gpt_utils import summarize_transcript, generate_viral_ideas, gpt_chat
from .memory import retrieve_context
from .rlhf import store_interaction, safe_call
from .eval_utils import compute_semantic_and_hallucination, compute_accuracy, client
import time

# =======================================
# Tool Wrappers
# =======================================


def tool_summarize(video_id: str):
    docs = retrieve_context(video_id, query="Summarize this video", k=10)
    text = "\n\n".join(docs) if docs else ""
    if not text:
        return "⚠️ No transcript available. Run transcription first."
    result = summarize_transcript(text)
    store_interaction("summarize", result, {"video_id": video_id})
    return result


def tool_highlights(video_id: str):
    docs = retrieve_context(video_id, query="Extract highlights", k=10)
    if not docs:
        return "⚠️ No transcript available. Run transcription first."
    result = "\n".join([f"- {d}" for d in docs[:5]])
    store_interaction("highlights", result, {"video_id": video_id})
    return result


def tool_viral(video_id: str):
    docs = retrieve_context(video_id, query="Suggest viral clips", k=10)
    text = "\n".join(docs) if docs else ""
    if not text:
        return "⚠️ No transcript available."
    result = generate_viral_ideas(text)
    store_interaction("viral", result, {"video_id": video_id})
    return result


def tool_transcribe(video_url: str):
    result, ctx = pipeline_core(video_url, task="Transcript")
    store_interaction("transcribe", result, {"video_id": ctx["video_id"]})
    return {"video_id": ctx["video_id"], "preview": result[:500]}


def tool_qna(video_id: str, question: str, ground_truth: str = None):
    t0 = time.perf_counter()
    docs = retrieve_context(video_id, query=question, k=6)
    if not docs:
        return "⚠️ No transcript available. Run transcription first."
    context = "\n".join(docs)
    result = gpt_chat(
        f"Answer this question based only on the transcript:\n{context}\n\nQ: {question}",
        system="You are a video Q&A assistant.",
    )
    latency_ms = (time.perf_counter() - t0) * 1000

    # 🔎 evaluation metrics
    metrics = compute_semantic_and_hallucination(result, docs)
    if ground_truth:
        metrics.update(compute_accuracy(result, ground_truth))
    metrics["latency_ms"] = latency_ms

    # 📤 log to LangSmith safely
    safe_call(
        client.log_event,
        name="qa_evaluation",
        inputs={
            "video_id": video_id,
            "question": question,
            "ground_truth_provided": bool(ground_truth),
        },
        outputs={"answer": result, "context_snippets": docs[:3]},
        metadata=metrics,
    )

    store_interaction("qna", result, {"video_id": video_id, "question": question})
    return result


def tool_app_info(query: str):
    docs = retrieve_context("app_info", query=query, k=5)
    if not docs:
        return "🤖 I don’t have app info for that."
    context = "\n".join(docs)
    result = gpt_chat(
        f"Answer this user query using only the following app knowledge:\n{context}\n\nQ: {query}",
        system="You are an app support assistant.",
    )
    store_interaction("app_info", result, {"query": query})
    return result


# =======================================
# Agent Setup
# =======================================

chat_memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

agent_llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.4,
    openai_api_key=os.environ["OPENAI_API_KEY"],
)

tools = [
    Tool(
        name="Transcribe",
        func=tool_transcribe,
        description="Transcribe audio/video or YouTube URL",
    ),
    Tool(
        name="Summarize",
        func=tool_summarize,
        description="Summarize a video by video_id",
    ),
    Tool(
        name="Highlights",
        func=tool_highlights,
        description="Extract highlights from a video_id",
    ),
    Tool(
        name="Viral",
        func=tool_viral,
        description="Generate viral clip ideas from a video_id",
    ),
    Tool(
        name="QnA",
        func=tool_qna,
        description="Answer a natural language question about a video (needs video_id)",
    ),
    Tool(
        name="AppInfo",
        func=tool_app_info,
        description="Answer user questions about ClipoFrameAI app features, pricing, usage",
    ),
]

jarvis_agent = initialize_agent(
    tools,
    agent_llm,
    agent="conversational-react-description",
    memory=chat_memory,
    verbose=True,
)

print("✅ Jarvis Agent initialized with Summarize, Highlights, Viral, QnA, AppInfo")


# =======================================
# Jarvis Core Entry Point
# =======================================


@traceable(name="jarvis_entry_core")
def jarvis_entry_core(
    user_text: str, audio_file=None, uploaded_file=None, context: dict = None
):
    """
    Main entry for Jarvis chat.
    - If video_id is provided in context -> use video tools (summarize, highlights, QnA, etc.)
    - If no video_id -> fallback to app knowledge / general assistant.
    """
    ctx = context or {}

    try:
        if ctx.get("video_id"):
            # 🎬 Video context present → Use video tools agent
            print(f"🎯 Running video QnA for video_id={ctx['video_id']}")
            response = jarvis_agent.run(user_text)
            return response

        else:
            # 💡 No video_id → fallback to app info or general Q/A
            print("💡 Running app-info / general assistant mode")
            app_info = """
            I’m Jarvis, your AI video assistant. 
            I can help you with:
            - Summaries of videos
            - Key highlights
            - Viral clip ideas
            - Auto-captions
            - Transcriptions
            You can also chat with me about how to use the app.
            """
            llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.5,
                openai_api_key=os.environ["OPENAI_API_KEY"],
            )
            result = llm.predict(f"{app_info}\n\nUser: {user_text}\nJarvis:")
            return result

    except Exception as e:
        print(f"❌ Jarvis core error: {e}")
        return "⚠️ Sorry, something went wrong with Jarvis."
