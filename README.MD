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
git clone https://github.com/vibek01/yupcha-chatbot-website.git
cd yupcha-chatbot-website

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
DATABASE_URL="your_supabase_url"

# OpenRouter API Configuration
OPENROUTER_API_KEY="your_openrouter_api_key"
OPENROUTER_BASE_URL="your_openrouter_base_url"
OPENROUTER_MODEL="your_openrouter_model"

🌐 frontend/.env
# FastAPI backend endpoint
VITE_API_URL="your_backend_url"

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