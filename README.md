# 🎓 AI StudyMate

A complete AI-powered study platform for college students, built with React + FastAPI + Google Gemini.

## Features
- 📝 **Notes Generator** – AI-generated study notes with headings, examples, and summaries
- 💡 **Doubt Solver** – Step-by-step explanations for any academic question
- 🎯 **Quiz Generator** – Multiple-choice quizzes with scoring and explanations
- 📅 **Study Planner** – Local task manager with progress tracking

## Quick Start

### 1. Configure the Gemini API Key
1. Get a free key at https://aistudio.google.com/app/apikey
2. Copy `backend/.env.example` → `backend/.env`
3. Paste your key: `GEMINI_API_KEY=AIza...`

### 2. Start the Backend (Python)
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
Backend runs at: http://127.0.0.1:8000

### 3. Start the Frontend (Node)
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

## Project Structure
```
AI-StudyMate/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Environment variable template
│   └── .env              # ← Create this (not in git!)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Backend and API key status |
| POST | `/generate-notes` | Generate study notes |
| POST | `/ask-doubt` | Answer academic questions |
| POST | `/generate-quiz` | Generate a quiz |

## Troubleshooting
- **Backend not connecting**: Ensure `python -m uvicorn main:app --reload` is running
- **API key error**: Check `backend/.env` contains a valid `GEMINI_API_KEY`
- **CORS error**: Make sure frontend runs on port 5173 and backend on 8000
- **Module not found**: Run `pip install -r requirements.txt` in the backend folder

WEB DEVLOPER
AMAN KUMAR
COER UNIVERSITY

LINKEDIN- www.linkedin.com/in/aman-kumar-b05056422
