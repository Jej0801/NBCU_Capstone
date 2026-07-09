# NBCU AI Navigation Assistant

A plain-JavaScript prototype for an AI-powered internal navigation assistant. The app helps NBCUniversal employees ask natural-language questions about onboarding, SAP workflows, HR tasks, IT support, equipment requests, and internal resources.

## Stack

- Frontend: React + Vite + Axios
- Backend: Node.js + Express
- AI: Claude API through `@anthropic-ai/sdk`
- Data: Mock NBCU-style resource records

## Project Structure

```text
frontend/   React + Vite UI
backend/    Express API, Claude integration, retrieval, mock data
```

## Setup

Install dependencies:

```bash
npm run install:all
```

Copy the backend environment example:

```bash
cp backend/.env.example backend/.env
```

Add your Claude API key to `backend/.env`:

```text
CLAUDE_API_KEY=your_key_here
```

The app also works without a key by returning a deterministic fallback answer from mock resources.

## Run

Backend:

```bash
npm run start:backend
```

Frontend:

```bash
npm run start:frontend
```

Default URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API

`POST /api/navigate`

```json
{
  "question": "Where do I request software access?"
}
```

Response:

```json
{
  "answer": "Concise guidance...",
  "nextSteps": ["Step 1", "Step 2"],
  "resources": [{ "label": "Portal", "url": "https://..." }],
  "confidence": "high",
  "escalation": {
    "contact": "Team Name",
    "reason": "When to escalate"
  }
}
```

## Notes

This is prototype data only. Mock URLs use `https://[system].nbcuni.com`-style domains and should be replaced with approved internal resources before any real deployment.
