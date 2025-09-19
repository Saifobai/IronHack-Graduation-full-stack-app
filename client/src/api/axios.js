// src/api/axios.js
import axios from "axios";
import { toast } from "react-toastify"; // if you use react-toastify; otherwise replace with your notifier

const api = axios.create({
    baseURL: "/api", // keep this as you asked
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token automatically if you store it in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // ensure you store token after login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response handler (credits example)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 402) {
            toast.error("Not enough credits. Please subscribe.");
            window.location.href = "/subscribe";
        }
        return Promise.reject(error);
    }
);

export default api;
