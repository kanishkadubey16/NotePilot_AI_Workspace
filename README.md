# 🚀 NotePilot AI Workspace

NotePilot AI is a professional, production-ready AI-powered notes workspace inspired by modern SaaS productivity tools like Notion and Evernote. It leverages the power of **Google Gemini AI** to help users summarize notes, extract action items, suggest titles, and improve writing quality.

![Project Preview](https://via.placeholder.com/1200x600?text=NotePilot+AI+Workspace+Preview)

## ✨ Features

- **🛡️ Secure Authentication**: JWT-based login/signup with persistent sessions.
- **📝 Advanced Workspace**: A 3-column layout (Sidebar, Notes List, Editor) for seamless productivity.
- **🤖 Gemini AI Integration**:
  - **Auto-Summarization**: Instantly condense long notes.
  - **Action Items**: Extract tasks and checklists using AI.
  - **Smart Titles & Tags**: AI-driven organization suggestions.
  - **Writing Improvement**: Refine your grammar and tone with one click.
- **📊 Productivity Dashboard**: Visualize your note-taking habits, AI usage trends, and active categories.
- **🔗 Public Sharing**: Generate unique, secure links to share your notes with anyone.
- **🌓 Dark Mode**: Complete theme support with persistent settings.
- **🔍 Live Search & Filtering**: Real-time search and category-based organization.
- **💾 Auto-Save**: Debounced background saving to ensure you never lose work.

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- React Router DOM
- Axios (with centralized Interceptors)
- Context API (Auth, Notes, Theme)
- Modern CSS (Custom variables for Dark Mode)

**Backend:**
- Node.js & Express.js
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI (Google Generative AI SDK)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kanishkadubey16/NotePilot_AI_Workspace.git
cd NotePilot_AI_Workspace
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update VITE_API_URL if needed
npm run dev
```

## 🌍 Deployment

### Frontend (Vercel)
The frontend is optimized for Vercel. Ensure `VITE_API_URL` points to your production backend.

### Backend (Render/Heroku)
The backend is ready for Render. Set your environment variables in the dashboard and use `node server.js` as the start command.

## 🏗️ Architecture

NotePilot AI follows a **Clean MVC Architecture** on the backend and a **Context-Based Provider Pattern** on the frontend. This ensures high scalability and maintainable code.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License
MIT License - created by [Kanishka Dubey](https://github.com/kanishkadubey16).
