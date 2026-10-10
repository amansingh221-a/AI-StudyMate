/**
 * API utility - all backend calls go through here.
 * Never expose the Gemini API key. All AI requests go to our own backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Parse an error response from the backend into a human-readable string.
 */
async function parseError(response) {
  try {
    const data = await response.json();
    if (data.detail) {
      return typeof data.detail === 'string'
        ? data.detail
        : JSON.stringify(data.detail);
    }
    return `Server error (${response.status})`;
  } catch {
    return `Server error (${response.status})`;
  }
}

/**
 * Check backend health status.
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Generate study notes for a given topic.
 * @param {string} topic
 * @param {string} [subject]
 */
export async function generateNotes(topic, subject = '') {
  const res = await fetch(`${API_BASE}/generate-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: topic.trim(), subject: subject.trim() }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Ask a doubt / academic question.
 * @param {string} question
 */
export async function askDoubt(question) {
  const res = await fetch(`${API_BASE}/ask-doubt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: question.trim() }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Generate a quiz on a topic.
 * @param {string} topic
 * @param {string} difficulty  - "Easy" | "Medium" | "Hard"
 * @param {number} numQuestions
 */
export async function generateQuiz(topic, difficulty = 'Medium', numQuestions = 5) {
  const res = await fetch(`${API_BASE}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: topic.trim(),
      difficulty,
      num_questions: numQuestions,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

