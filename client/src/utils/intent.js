// src/utils/intent.js

// 🔎 Normalize and detect user intent
// src/utils/intent.js

// 🔎 Normalize and detect user intent
export const detectIntent = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    // Common variations & typos included
    if (lower.includes("summarize") || lower.includes("summary") || lower.includes("summrise"))
        return "summarize";
    if (lower.includes("highlight") || lower.includes("highlights") || lower.includes("hilite"))
        return "highlight";
    if (lower.includes("clip") || lower.includes("clips") || lower.includes("viral"))
        return "clips";
    if (lower.includes("caption") || lower.includes("captions") || lower.includes("subtitles"))
        return "captions";
    if (
        lower.includes("transcribe") ||
        lower.includes("transcript") ||
        lower.includes("transcription") ||
        lower.includes("trasncribe")
    )
        return "transcription";

    return null; // no intent detected
};
