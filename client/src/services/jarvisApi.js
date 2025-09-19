import api from "../api/axios";


// ✅ Chat — matches backend
// ✅ Chat — consistent with other API functions
// export const jarvisChat = async (token, message, videoUrl = null, videoId = null) => {
//     const res = await api.post(
//         "/ai/chat",
//         { message, videoUrl, video_id: videoId },
//         token ? { headers: { Authorization: `Bearer ${token}` } } : {}
//     );
//     return res.data;
// };






// ✅ Chat — matches backend
// ✅ Chat — consistent with other API functions
// export const jarvisChat = async (token, message, videoUrl = null, videoId = null) => {
//     const res = await api.post(
//         "/ai/chat",
//         { message, videoUrl, video_id: videoId },
//         token ? { headers: { Authorization: `Bearer ${token}` } } : {}
//     );
//     return res.data;
// };


export const jarvisChat = async (token, message, videoUrl = null, videoId = null) => {
    const res = await api.post(
        "/ai/chat",
        { message, url: videoUrl, video_id: videoId }, // ✅ url, not videoUrl
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
};




export const summarizeVideo = async (token, videoUrl) => {
    const res = await api.post(
        "/ai/summarize",
        { videoUrl }, // ✅ fixed key
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
};

export const generateHighlights = async (token, videoUrl) => {
    const res = await api.post(
        "/ai/highlights",
        { videoUrl }, // ✅ fixed key
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
};

export const transcribeVideo = async (token, videoUrl) => {
    const res = await api.post(
        "/ai/transcribe",
        { videoUrl }, // ✅ fixed key
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
};

export const generateViralClips = async (token, videoUrl) => {
    const res = await api.post(
        "/ai/viral",
        { videoUrl }, // ✅ fixed key
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    return res.data;
};



// delete job by ID (only owner or admin)
export const deleteJobById = async (token, jobId) => {
    return await api.delete(
        `/jobs/delete/${jobId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    ).then(res => res.data);
}