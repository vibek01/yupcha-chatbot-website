# 📢 Yupcha Tweet Generator Website

**Yupcha Tweet Generator** is a sleek, AI-powered platform that enables users to effortlessly generate and publish high-quality tweets to a custom-built **Twitter clone by Yupcha Softwares**. With a modern UI, lightning-fast backend, and no authentication required, it simplifies content creation through the power of fine-tuned AI.

---

## ✨ Features

- 🔮 AI-based tweet generation using **Mistral 24B** (fine-tuned) via OpenRouter  
- 📝 Create, edit, and save tweets as **drafts**
- 📤 **Publish** tweets directly to Yupcha’s Twitter clone
- 📃 View both **drafts** and **posted tweets** on the frontend
- 💻 **No authentication** – instant usage for all users
- 🎨 Clean, modern, and **unique UI** built with Solid.js

---

## 🛠️ Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | [Solid.js](https://solidjs.com/), [Vite](https://vitejs.dev/) |
| Backend     | [FastAPI](https://fastapi.tiangolo.com/)         |
| AI Model    | [OpenRouter](https://openrouter.ai/) – Mistral 24B (fine-tuned) |
| Database    | [Supabase](https://supabase.com/)                |
| Deployment  | Cloudflare Pages (Frontend), Render (Backend), Supabase (Vercel-hosted) |

---

## 🌐 Live Demo

🔗 **Live App:** [https://yupcha-chatbot-website.pages.dev](https://yupcha-chatbot-website.pages.dev)

> ✅ Posts appear instantly after submission.  
> 📝 Drafts are stored persistently and editable anytime.

---

## 📦 Local Development

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/yupcha-tweet-generator.git
cd yupcha-tweet-generator

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev
```
```bash
3️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

```bash
⚙️ Environment Variables
Create a .env file in both the frontend/ and backend/ directories.

🔧 backend/.env
# PostgreSQL DB via Supabase (asyncpg URI)
DATABASE_URL="postgresql+asyncpg://postgres.yjwpjrjbnnthwoievjfa:ZntQ2XGrsoNxfY5Y@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"

# OpenRouter API Configuration
OPENROUTER_API_KEY="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"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="mistralai/mistral-small-3.2-24b-instruct:free"

# Yupcha Twitter Clone Server API
TWITTERCLONE_BASE_URL="https://twitterclone-server-2xz2.onrender.com"
TWITTERCLONE_API_KEY="vibek_07370767ec46c404c434e06d5d5237e7"

🌐 frontend/.env
# FastAPI backend endpoint
VITE_API_URL=https://yupcha-chatbot-website.onrender.com/api

# Twitter Clone API key (used for frontend requests if needed)
TWITTER_API_KEY=vibek_07370767ec46c404c434e06d5d5237e7
```
---

# 🧠 How It Works
User lands on the homepage.

Enters a prompt → AI generates tweet content.

Chooses to save as draft or publish directly.

All drafts and posts are listed and editable from the frontend.

No login required. Data is stored anonymously in Supabase.

🔒 Auth & Security
✅ No authentication system.

🗃️ All data is stored in Supabase under a shared, general scope.

🔁 Real-time syncing between frontend and backend enabled via REST.