Yupcha Tweet Generator Website
Yupcha Tweet Generator Website is a sleek, AI-powered platform that enables users to generate high-quality social media posts and publish them directly to a Twitter clone developed by Yupcha Softwares. Built with performance and simplicity in mind, it leverages cutting-edge technologies and modern UI to deliver a seamless content creation experience — no authentication required.

✨ Key Features
🔮 AI-Powered Tweet Generation using Mistral 24B (fine-tuned) via OpenRouter

✍️ Create, Edit, and Save posts as Drafts

📢 Publish posts directly to Yupcha’s internal Twitter clone

🔁 View All Posts & Drafts instantly on the frontend

💻 No Authentication – Instant access for all users

🎨 Modern, Unique & Sleek Design using Solid.js

🚀 Tech Stack
Layer	Technology
Frontend	Solid.js, Vite
Backend	FastAPI
AI Model	OpenRouter - Mistral 24B (fine-tuned)
Database	Supabase
Hosting	Cloudflare Pages (Frontend), Render (Backend), Supabase (DB on Vercel infra)

🌐 Live Demo
🔗 Live App: https://yupcha-chatbot-website.pages.dev/
(Note: Posts are visible immediately after submission. Drafts are stored for persistent editing.)

📸 Screenshots
Home Page	Generate Tweet	Drafts & Posts

📦 Local Development
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/yourusername/yupcha-tweet-generator.git
cd yupcha-tweet-generator
2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
3. Backend Setup
bash
Copy
Edit
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
⚙️ Environment Variables
Create the following .env files for the frontend and backend.

Frontend (.env)
env
Copy
Edit
VITE_BACKEND_URL=https://your-backend.render.app
Backend (.env)
env
Copy
Edit
# PostgreSQL DB via Supabase (asyncpg URI)
DATABASE_URL="postgresql+asyncpg://postgres.yjwpjrjbnnthwoievjfa:ZntQ2XGrsoNxfY5Y@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"

# OpenRouter API Configuration
OPENROUTER_API_KEY="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"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="mistralai/mistral-small-3.2-24b-instruct:free"

# Twitter Clone Server Endpoint (Yupcha Internal API)
TWITTERCLONE_BASE_URL="https://twitterclone-server-2xz2.onrender.com"
TWITTERCLONE_API_KEY="vibek_07370767ec46c404c434e06d5d5237e7"

# FastAPI backend endpoint
VITE_API_URL=https://yupcha-chatbot-website.onrender.com/api

# Twitter Clone API key (used for frontend requests if needed)
TWITTER_API_KEY=vibek_07370767ec46c404c434e06d5d5237e7


🧠 How It Works
User visits the homepage.

Enters a prompt to generate a tweet using Mistral 24B (OpenRouter).

Chooses to Save as Draft or Post to Yupcha's internal Twitter clone.

All drafts and posted tweets are listed on the main UI for review and editing.

🔒 Auth & Security
No authentication is required.

Each user's interaction is stored under a general anonymous scope.

Content is saved to Supabase, which handles real-time syncing and storage.