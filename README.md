# 🎬 ClipoFrameAI — AI-Powered Video Summaries, Highlights & Viral Clips

---

## ✨ Overview

ClipoFrameAI is a **full-stack AI platform** that transforms long-form videos into:

- ✅ **Summaries** — fast insights in seconds
- ✂️ **Highlights** — key moments automatically extracted
- 🎥 **Viral Clips** — short clips ready for TikTok/YouTube Shorts
- 🎙️ **Transcriptions** — full text with auto-captions

Built with **Machine Learning (Whisper + LLMs)**, **NLP**, and a modern **React/Redux frontend** — powered by a modular FastAPI backend.

---

## 🧠 Tech Stack

### 🔹 Frontend

- **React + Vite** with **TailwindCSS**
- State Management: **Redux**
- Components: **Framer Motion** + **Lucide Icons**
- **Jarvis Chat Assistant** (floating AI agent with voice input)

### 🔹 Backend

- **FastAPI** (Python 3.11)
- **LangChain + LangSmith** for LLM orchestration
- **Whisper** for transcription
- **FFmpeg** for video/audio processing
- **Custom RLHF pipeline** for feedback and fine-tuning

### 🔹 AI & ML

- **Whisper** → transcription
- **GPT (LLM)** → summarization, highlight detection, viral segmentation
- **Vector Memory** → context retrieval (highlights)
- **RLHF (Reinforcement Learning with Human Feedback)** → improves output quality

### 🔹 Storage & Utilities

- Local `storage/` for transcripts, audio, and generated clips
- JSON logging for interactions
- Safe API wrappers for LangSmith

---

## 🚀 Features

- 🎤 **Paste or upload any video** (YouTube, TikTok, MP4)
- 🤖 **Jarvis AI Assistant**: chat, ask for summaries, highlights, transcripts
- 🖥️ **User Dashboard**:
  - Run Summarize, Transcribe, Viral Clips, Highlights
  - Download / Upload videos
  - “My Work” page to review past results
- ⚡ **Interactive UI**: real-time chat + feature cards highlight + smooth navigation

---

## 📂 Project Structure

```bash
IronFullStackApp/
│
├── backend/               # FastAPI + AI pipeline
│   ├── controllers/       # Summarize, Transcribe, Highlights, Viral
│   ├── utils/             # whisper, gpt, rlhf, memory, clipping
│   ├── routes/            # FastAPI routes
│   └── storage/           # transcripts, audio, clips
│
├── frontend/              # React + Redux + Tailwind
│   ├── src/components/    # JarvisChat, Overlays, Modals
│   ├── src/pages/         # Home, Dashboard, MyWork
│   └── src/services/      # jarvisApi.js
│
└── README.md              # You are here 🚀
🛠️ Installation
🔹 Backend
bash
Code kopieren
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
🔹 Frontend
bash
Code kopieren
cd frontend
npm install
npm run dev
📸 Screenshots
🏠 Homepage
AI-powered intro with Jarvis Assistant & video preview.

📊 User Dashboard
Run AI tasks: Summaries, Highlights, Clips, Transcriptions.

💬 Jarvis Floating Chat
Talk with Jarvis using text or speech — fully integrated.

💡 Future Roadmap
🌐 Hosting (Vercel + Render/AWS)

💳 Monetisation (Free/Premium tiers, API access)

📱 Mobile app (React Native / Expo)

📊 Analytics dashboard for creators

👨‍🎓 Credits
Institute: Ironhack

Teacher: Isabella Bicalho
Teacher: Tejal Bhatti

Student & Developer: Saif ✨

Date: 19.09.2025
```
