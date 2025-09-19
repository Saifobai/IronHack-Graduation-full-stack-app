from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
import hashlib, os
from datetime import datetime


from dotenv import load_dotenv

load_dotenv()  # ensure .env is loaded

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")


OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
INDEX_NAME = "clipoframeaiapp04"

pc = Pinecone(api_key=PINECONE_API_KEY)
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small", openai_api_key=OPENAI_API_KEY
)


def make_id(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def store_context(video_id: str, text: str):
    index = pc.Index(INDEX_NAME)
    vec = embeddings.embed_query(text)
    uid = make_id(text)
    index.upsert(
        [{"id": uid, "values": vec, "metadata": {"video_id": video_id, "text": text}}],
        namespace=video_id,
    )
    return uid


def retrieve_context(video_id: str, query: str, k: int = 20):
    index = pc.Index(INDEX_NAME)
    query_vec = embeddings.embed_query(query)
    res = index.query(
        namespace=video_id, vector=query_vec, top_k=k, include_metadata=True
    )
    return [m["metadata"]["text"] for m in res.get("matches", []) if "metadata" in m]
