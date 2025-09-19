export const formatReply = (data) => {
    if (!data) return "⚠️ No reply";

    // Handle common cases
    if (typeof data.response === "string") return data.response;
    if (typeof data.result === "string") return data.result;

    // Handle summaries
    if (data.result?.summary) return data.result.summary;

    // Handle highlights
    if (Array.isArray(data.result?.highlights)) {
        return data.result.highlights.join("\n• ");
    }

    // Handle transcription
    if (data.result?.transcription) return data.result.transcription;

    // Handle clips
    if (Array.isArray(data.result?.clips)) {
        return data.result.clips.join("\n");
    }

    // If response is an object → stringify
    if (typeof data.response === "object")
        return JSON.stringify(data.response, null, 2);

    return "⚠️ No readable reply";
};