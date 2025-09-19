import time, re, numpy as np
from langsmith import Client
from langchain_openai import OpenAIEmbeddings

client = Client()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def _cosine(a, b):
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b) + 1e-9
    return float(np.dot(a, b) / denom)


def sentence_split(text):
    return [s.strip() for s in re.split(r"[.?!]\s+", text) if s.strip()]


def compute_semantic_and_hallucination(answer, context_texts, threshold=0.65):
    ans_vec = embeddings.embed_query(answer)
    ctx_vecs = (
        [embeddings.embed_query(c) for c in context_texts] if context_texts else []
    )
    sims = [_cosine(ans_vec, v) for v in ctx_vecs] if ctx_vecs else [0.0]
    semantic_max = max(sims) if sims else 0.0
    semantic_avg = sum(sims) / len(sims) if sims else 0.0

    # Hallucination = sentences not matching context
    sents = sentence_split(answer)
    sent_sims = []
    for s in sents:
        v = embeddings.embed_query(s)
        sim = max([_cosine(v, cv) for cv in ctx_vecs]) if ctx_vecs else 0.0
        sent_sims.append(sim)
    hallucination_rate = (
        sum(1 for s in sent_sims if s < threshold) / len(sent_sims)
        if sent_sims
        else 0.0
    )

    return {
        "semantic_max": semantic_max,
        "semantic_avg": semantic_avg,
        "hallucination_rate": hallucination_rate,
        "sentence_scores": sent_sims,
    }


def compute_accuracy(answer, ground_truth):
    exact = 1.0 if answer.strip().lower() == ground_truth.strip().lower() else 0.0
    sim = _cosine(embeddings.embed_query(answer), embeddings.embed_query(ground_truth))
    return {"exact_match": exact, "semantic_similarity_with_gt": sim}
