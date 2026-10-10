"""
AI StudyMate - FastAPI Backend
Connects to Google Gemini API for AI-powered study features.
"""

import os
import json
import re
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Load .env from the same directory as this file (works regardless of CWD)
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# ---------------------------------------------------------------------------
# Initialise Gemini client (lazy – only fails when a request is made)
# ---------------------------------------------------------------------------
_gemini_client = None


def get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Gemini API key is not configured. "
                    "Please create backend/.env and set GEMINI_API_KEY."
                ),
            )
        try:
            from google import genai  # type: ignore
            _gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        except ImportError:
            raise HTTPException(
                status_code=503,
                detail="google-genai package is not installed. Run: pip install google-genai",
            )
    return _gemini_client


def generate_content(prompt: str) -> str:
    """Call Gemini and return the text response."""
    client = get_gemini_client()
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        return response.text
    except Exception as exc:
        error_msg = str(exc)
        if "API_KEY_INVALID" in error_msg or "invalid api key" in error_msg.lower():
            raise HTTPException(
                status_code=401,
                detail="Invalid Gemini API key. Please check your backend/.env file.",
            )
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API error: {error_msg}",
        )


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI StudyMate API",
    description="Backend for AI StudyMate – powered by Google Gemini",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic request models
# ---------------------------------------------------------------------------


class NotesRequest(BaseModel):
    topic: str
    subject: Optional[str] = ""

    @field_validator("topic")
    @classmethod
    def topic_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Topic cannot be empty.")
        return v.strip()


class DoubtRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Question cannot be empty.")
        return v.strip()


class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "Medium"
    num_questions: int = 5

    @field_validator("topic")
    @classmethod
    def topic_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Topic cannot be empty.")
        return v.strip()

    @field_validator("difficulty")
    @classmethod
    def valid_difficulty(cls, v: str) -> str:
        allowed = {"Easy", "Medium", "Hard"}
        if v not in allowed:
            raise ValueError(f"Difficulty must be one of {allowed}.")
        return v

    @field_validator("num_questions")
    @classmethod
    def valid_num_questions(cls, v: int) -> int:
        if not (1 <= v <= 20):
            raise ValueError("Number of questions must be between 1 and 20.")
        return v


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/")
def root():
    return {"message": "Welcome to AI StudyMate API!", "status": "running"}


@app.get("/health")
def health():
    api_key_configured = bool(GEMINI_API_KEY)
    return {
        "status": "healthy",
        "api_key_configured": api_key_configured,
        "model": GEMINI_MODEL,
    }


@app.post("/generate-notes")
def generate_notes(req: NotesRequest):
    subject_hint = f" (Subject: {req.subject})" if req.subject else ""
    prompt = f"""You are an expert study notes creator for college students.

Generate comprehensive, well-structured study notes on the topic: "{req.topic}"{subject_hint}

Format the notes exactly like this:

# {req.topic} - Study Notes

## Overview
[Brief introduction - 2-3 sentences]

## Key Definitions
- **Term 1**: Definition
- **Term 2**: Definition
[Add all important terms]

## Core Concepts
### Concept 1: [Name]
[Explanation]

### Concept 2: [Name]
[Explanation]
[Continue for all important concepts]

## Important Points to Remember
- Point 1
- Point 2
- Point 3
[Add 5-8 bullet points]

## Examples
### Example 1
[Detailed example with explanation]

### Example 2
[Another example]

## Summary
[Concise 3-5 sentence summary of the entire topic]

## Quick Revision Questions
1. [Question 1]
2. [Question 2]
3. [Question 3]
[Add 3-5 questions]

Make the notes beginner-friendly, detailed, and suitable for exam preparation.
"""
    notes_text = generate_content(prompt)
    return {"notes": notes_text, "topic": req.topic}


@app.post("/ask-doubt")
def ask_doubt(req: DoubtRequest):
    prompt = f"""You are a friendly and knowledgeable academic tutor helping a college student.

The student has asked: "{req.question}"

Please provide a clear, step-by-step explanation. Follow these guidelines:
1. Start with a simple, direct answer
2. Break down the explanation into numbered steps if applicable
3. Use simple English – avoid overly technical jargon unless necessary
4. If it's a math or programming problem, show the solution step-by-step with working
5. Include a real-world analogy or example if it helps understanding
6. End with a brief summary or "Key Takeaway"

Format your response with clear headings and bullet points where appropriate.
Be encouraging and supportive in your tone.
"""
    answer = generate_content(prompt)
    return {"answer": answer, "question": req.question}


@app.post("/generate-quiz")
def generate_quiz(req: QuizRequest):
    prompt = f"""You are a quiz generator for college students.

Generate exactly {req.num_questions} multiple-choice questions on the topic: "{req.topic}"
Difficulty level: {req.difficulty}

IMPORTANT: Respond with ONLY a valid JSON array. No markdown, no code fences, no extra text.

The JSON must follow this exact structure:
[
  {{
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Why this answer is correct."
  }}
]

Rules:
- "correct_answer" is the 0-based index of the correct option (0, 1, 2, or 3)
- Each question must have exactly 4 options
- Questions should match the {req.difficulty} difficulty level
- Make questions educational and clear
- Generate exactly {req.num_questions} questions

Respond with the JSON array only.
"""
    raw = generate_content(prompt)

    # Strip markdown code fences if Gemini added them
    cleaned = raw.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    # Find JSON array in the response
    match = re.search(r"\[.*\]", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    try:
        questions = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini returned malformed JSON. Try again. Details: {str(exc)}",
        )

    if not isinstance(questions, list) or len(questions) == 0:
        raise HTTPException(
            status_code=502,
            detail="Gemini returned an empty or invalid quiz. Please try again.",
        )

    # Validate each question
    validated = []
    for i, q in enumerate(questions):
        if not isinstance(q, dict):
            continue
        if not all(k in q for k in ("question", "options", "correct_answer", "explanation")):
            continue
        if not isinstance(q["options"], list) or len(q["options"]) != 4:
            continue
        if not isinstance(q["correct_answer"], int) or q["correct_answer"] not in range(4):
            continue
        q["id"] = i + 1
        validated.append(q)

    if not validated:
        raise HTTPException(
            status_code=502,
            detail="No valid questions were generated. Please try again.",
        )

    return {
        "questions": validated,
        "topic": req.topic,
        "difficulty": req.difficulty,
        "total": len(validated),
    }

