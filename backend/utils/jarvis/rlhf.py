# import json, time, os, signal
# from langsmith import Client

# RLHF_FILE = "rlhf_data.jsonl"
# _last_response = None
# client = Client()


# # --- Safe Wrapper for LangSmith ---
# class TimeoutException(Exception):
#     pass


# def timeout_handler(signum, frame):
#     raise TimeoutException()


# def safe_call(fn, *args, **kwargs):
#     """
#     Wrap LangSmith calls with 3s timeout + error suppression.
#     """
#     signal.signal(signal.SIGALRM, timeout_handler)
#     signal.alarm(3)  # ⏱ 3s limit
#     try:
#         return fn(*args, **kwargs)
#     except TimeoutException:
#         print("⚠️ LangSmith call timed out")
#         return None
#     except Exception as e:
#         print(f"⚠️ LangSmith error: {e}")
#         return None
#     finally:
#         signal.alarm(0)  # reset alarm


# # --- Custom Evaluator ---
# def viral_accuracy(prediction: str, reference: str):
#     pred = prediction.lower()
#     ref = reference.lower()
#     score = 1.0 if any(word in pred for word in ref.split()[:5]) else 0.0
#     return {"viral_accuracy": score}


# def store_interaction(prompt, response, metadata=None):
#     """
#     Save interaction locally + safely log to LangSmith.
#     """
#     global _last_response
#     entry = {
#         "timestamp": time.time(),
#         "prompt": prompt,
#         "response": response,
#         "metadata": metadata or {},
#     }

#     # --- Save locally ---
#     with open(RLHF_FILE, "a", encoding="utf-8") as f:
#         f.write(json.dumps(entry) + "\n")
#     _last_response = entry

#     # --- Log Run to LangSmith safely ---
#     run = safe_call(
#         client.create_run,
#         name="pipeline_interaction",
#         inputs={"prompt": prompt},
#         outputs={"response": response},
#         run_type="chain",
#         tags=["rlhf", "pipeline"],
#     )
#     if run:
#         print("✅ Logged run to LangSmith")

#     # --- Manual Evaluation ---
#     try:
#         input_text = metadata.get("transcript", "") if metadata else ""
#         reference_text = metadata.get("reference", input_text)
#         score = viral_accuracy(str(response), str(reference_text))
#         print("✅ Evaluation results:", score)

#         if run and score:
#             safe_call(client.update_run, run.id, metrics=score)

#         dataset = None
#         datasets = safe_call(client.list_datasets, dataset_name="rlhf_evals")
#         if datasets:
#             dataset = datasets[0]
#         else:
#             dataset = safe_call(
#                 client.create_dataset,
#                 dataset_name="rlhf_evals",
#                 description="Manual evals of pipeline outputs",
#             )

#         if dataset:
#             safe_call(
#                 client.create_example,
#                 inputs={"input": input_text},
#                 outputs={
#                     "prediction": str(response),
#                     "reference": reference_text,
#                     **score,
#                 },
#                 dataset_id=dataset.id,
#             )

#     except Exception as e:
#         print(f"⚠️ Evaluation error: {e}")


# def add_feedback(is_helpful: bool):
#     """
#     Human feedback logger (helpful / not helpful).
#     """
#     global _last_response
#     if not _last_response:
#         return "⚠️ No response to rate."

#     fb_entry = dict(_last_response)
#     fb_entry["feedback"] = "helpful" if is_helpful else "not_helpful"

#     with open(RLHF_FILE, "a", encoding="utf-8") as f:
#         f.write(json.dumps(fb_entry) + "\n")

#     # 📤 log feedback to LangSmith safely
#     safe_call(
#         client.create_run,
#         name="human_feedback",
#         inputs={"prompt": fb_entry["prompt"]},
#         outputs={"response": fb_entry["response"]},
#         run_type="feedback",
#         tags=["rlhf", "feedback"],
#         metadata={
#             "feedback": fb_entry["feedback"],
#             "video_id": fb_entry.get("metadata", {}).get("video_id"),
#         },
#     )

#     return "✅ Feedback saved!"


import json, time, os, signal, platform, traceback
from langsmith import Client

RLHF_FILE = "rlhf_data.jsonl"
_last_response = None
client = Client()


# --- Safe Wrapper for LangSmith ---
class TimeoutException(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutException()


def safe_call(fn, *args, **kwargs):
    """
    Wrap LangSmith calls with timeout + error suppression.
    Uses SIGALRM on Linux/macOS, skips on Windows.
    """
    use_alarm = platform.system() != "Windows"
    if use_alarm:
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(3)  # ⏱ 3s limit

    try:
        return fn(*args, **kwargs)
    except TimeoutException:
        print("⚠️ LangSmith call timed out")
        return None
    except Exception as e:
        print(f"⚠️ LangSmith error: {e}")
        traceback.print_exc()
        return None
    finally:
        if use_alarm:
            signal.alarm(0)  # reset alarm


# --- Custom Evaluator ---
def viral_accuracy(prediction: str, reference: str):
    pred = prediction.lower()
    ref = reference.lower()
    score = 1.0 if any(word in pred for word in ref.split()[:5]) else 0.0
    return {"viral_accuracy": score}


def store_interaction(prompt, response, metadata=None):
    """
    Save interaction locally + safely log to LangSmith.
    """
    global _last_response
    entry = {
        "timestamp": time.time(),
        "prompt": prompt,
        "response": response,
        "metadata": metadata or {},
    }

    # --- Save locally ---
    with open(RLHF_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    _last_response = entry

    # --- Log Run to LangSmith safely ---
    run = safe_call(
        client.create_run,
        name="pipeline_interaction",
        inputs={"prompt": prompt},
        outputs={"response": response},
        run_type="chain",
        tags=["rlhf", "pipeline"],
    )
    if run:
        print("✅ Logged run to LangSmith")

    # --- Manual Evaluation ---
    try:
        input_text = metadata.get("transcript", "") if metadata else ""
        reference_text = metadata.get("reference", input_text)
        score = viral_accuracy(str(response), str(reference_text))
        print("✅ Evaluation results:", score)

        if run and score:
            safe_call(client.update_run, run.id, metrics=score)

        dataset = None
        try:
            datasets = list(
                safe_call(client.list_datasets, dataset_name="rlhf_evals") or []
            )
            if datasets:
                dataset = datasets[0]
            else:
                dataset = safe_call(
                    client.create_dataset,
                    dataset_name="rlhf_evals",
                    description="Manual evals of pipeline outputs",
                )
        except Exception as e:
            print(f"⚠️ Dataset handling error: {e}")
            dataset = None

        if dataset:
            safe_call(
                client.create_example,
                inputs={"input": input_text},
                outputs={
                    "prediction": str(response),
                    "reference": reference_text,
                    **score,
                },
                dataset_id=dataset.id,
            )

    except Exception as e:
        print(f"⚠️ Evaluation error: {e}")

    except Exception as e:
        print(f"⚠️ Evaluation error: {e}")


def add_feedback(is_helpful: bool):
    """
    Human feedback logger (helpful / not helpful).
    """
    global _last_response
    if not _last_response:
        return "⚠️ No response to rate."

    fb_entry = dict(_last_response)
    fb_entry["feedback"] = "helpful" if is_helpful else "not_helpful"

    with open(RLHF_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(fb_entry) + "\n")

    # 📤 log feedback to LangSmith safely
    safe_call(
        client.create_run,
        name="human_feedback",
        inputs={"prompt": fb_entry["prompt"]},
        outputs={"response": fb_entry["response"]},
        run_type="feedback",
        tags=["rlhf", "feedback"],
        metadata={
            "feedback": fb_entry["feedback"],
            "video_id": fb_entry.get("metadata", {}).get("video_id"),
        },
    )

    return "✅ Feedback saved!"
