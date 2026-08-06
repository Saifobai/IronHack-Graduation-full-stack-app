from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
import hashlib, os
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
INDEX_NAME = "clipoframeaiapp04"

pc = Pinecone(api_key=PINECONE_API_KEY)
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY
)


def make_id(video_id: str, chunk_index: int, text: str) -> str:
    return hashlib.md5(f"{video_id}:{chunk_index}:{text[:50]}".encode("utf-8")).hexdigest()


def chunk_text(text: str, chunk_size: int = 220, overlap: int = 40):
    """
    Split into overlapping word-count chunks.
    ~220 words stays well under the 8,191-token embedding limit per call
    and is small enough for retrieval to actually mean something.
    """
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunks.append(" ".join(words[start:end]))
        if end >= len(words):
            break
        start = end - overlap
    return chunks


def store_context(video_id: str, text: str):
    index = pc.Index(INDEX_NAME)
    chunks = chunk_text(text)
    if not chunks:
        return []

    vectors = []
    for i, chunk in enumerate(chunks):
        vec = embeddings.embed_query(chunk)
        uid = make_id(video_id, i, chunk)
        vectors.append(
            {
                "id": uid,
                "values": vec,
                "metadata": {
                    "video_id": video_id,
                    "chunk_index": i,
                    "text": chunk,
                    "stored_at": datetime.utcnow().isoformat(),
                },
            }
        )

    index.upsert(vectors, namespace=video_id)
    return [v["id"] for v in vectors]


def retrieve_context(video_id: str, query: str, k: int = 20):
    index = pc.Index(INDEX_NAME)
    query_vec = embeddings.embed_query(query)
    res = index.query(
        namespace=video_id, vector=query_vec, top_k=k, include_metadata=True
    )
    matches = res.get("matches", [])
    # re-order chronologically so the returned context reads coherently,
    # instead of shuffled by raw similarity score
    matches.sort(key=lambda m: m.get("metadata", {}).get("chunk_index", 0))
    return [m["metadata"]["text"] for m in matches if "metadata" in m]