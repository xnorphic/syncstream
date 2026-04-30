# skill.checker

```
███████╗██╗  ██╗██╗██╗     ██╗      ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗███████╗██████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
███████╗█████╔╝ ██║██║     ██║     ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
╚════██║██╔═██╗ ██║██║     ██║     ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
███████║██║  ██╗██║███████╗███████╗╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

> **The AI Security Primitive the Community Has Been Waiting For.**
> Analyze, score, and curate Claude Skills with zero-day threat detection, vector memory, and automated safe-skill storage.

[![Version](https://img.shields.io/badge/version-1.1.0-30d158?style=flat-square&labelColor=201d1d)](https://github.com/xnorphic/syncstream)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-fdfcfc?style=flat-square&labelColor=201d1d)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-007aff?style=flat-square&labelColor=201d1d)](./LICENSE)
[![Live](https://img.shields.io/badge/live-production-30d158?style=flat-square&labelColor=201d1d)](https://skill-checker-iota.vercel.app)

**[Live Website](https://skill-checker-iota.vercel.app)** · [Admin Dashboard](https://skill-checker-iota.vercel.app/admin) · [Report a Bug](https://github.com/xnorphic/syncstream/issues) · [Request a Feature](https://github.com/xnorphic/syncstream/issues)

---

## The Philosophy: Secure-by-Design AI

Every Claude Skill is a system prompt. And every system prompt is a potential attack surface.

Prompt injections are silent. Jailbreaks are evolving daily. Data exfiltration paths are invisible to the naked eye. The AI community has been shipping Skills without a security primitive to evaluate them against — until now.

**skill.checker** is built on a single conviction: **AI systems must be Secure-by-Design, not patched after the fact.** We believe that every prompt that enters an AI pipeline should be analyzed for malicious intent before it reaches a model. Not as an afterthought. Not as a compliance checkbox. As a first-class engineering concern.

This tool provides three layers of defense:
1. **Instant vector memory** — known malicious patterns are caught in milliseconds via Pinecone cosine similarity.
2. **Zero-day LLM analysis** — unknown threats are analyzed by Claude Sonnet (Gemini 2.5 Flash fallback) using a hardened meta-prompt.
3. **Auto-curation** — safe, high-quality skills are automatically categorized, scored, and stored in a local vetted library for reuse.

---

## Top Features

### ⚡ Zero-Day LLM Analysis
The core engine. Every skill submitted is embedded (OpenAI `text-embedding-3-small`, 1536 dimensions) and checked against a Pinecone vector index. On a cache miss, Claude Sonnet analyzes the prompt using a strict meta-prompt that identifies:
- **Prompt injection techniques** — delimiter confusion, instruction override, indirect injection via RAG
- **Jailbreaking vectors** — DAN personas, role-play bypasses, Base64 encoding, hypothetical framing, token smuggling
- **Intended benefits** — the constructive, legitimate purpose of the skill
- **Potential harms** — data exfiltration paths, manipulation surface, social engineering risk

Results are returned as structured JSON: `threat_level`, `summary`, `benefits`, `potential_harms`, `injection_techniques`, `jailbreak_techniques`.

### 🧠 Pinecone Vector Memory
Analyzed skills are embedded and upserted into Pinecone with a cosine similarity threshold of **>0.90**. This creates a persistent threat memory: the second a known-malicious prompt variant appears, it's identified instantly without an LLM call. As the index grows, the system gets faster and smarter. This is the difference between a one-shot scanner and a living security system.

### 🔄 Gemini 2.5 Flash Fallback
The LLM pipeline uses a try/catch architecture: Claude Sonnet is the primary analyzer. If Anthropic is unavailable (credit exhaustion, rate limits, outages), the system automatically falls back to Google Gemini 2.5 Flash with the identical meta-prompt. The frontend displays `via gemini fallback` transparently. Zero downtime. Zero user friction.

### 💳 Stripe Paywall (5,000 Character Limit)
Free tier analysis is capped at 5,000 characters. Skills exceeding this limit trigger a high-visibility paywall alert — the Analyze button is hidden and a `Unlock Deep Scan — $1.00` Stripe link is displayed. This monetization layer is enforced client-side with server-side validation as the trust boundary.

### 🛡 Secure Admin Dashboard
A password-protected admin panel at `/admin` built with Material UI (dark-themed to DESIGN.md spec). The frontend sends the admin secret as a Bearer token — the comparison happens exclusively on the server against `ADMIN_SECRET` env var. The browser never receives the secret. Features:
- Query Pinecone top-50 by zero-vector similarity
- Display threat ID, level chip, summary, and flagged harms
- Color-coded threat severity (Emerald / Amber / Crimson)

### 🤖 V1.1 Auto-Curation Engine *(New)*
Safe skills don't disappear after analysis — they enter an automated evaluation pipeline. The `/api/admin/curate` endpoint:
1. Runs the skill through the **Two-Part Skill Evaluation System** (6-criterion rubric, 0–95 points)
2. Categorizes it by **Category** (Coding, Writing, Analysis...) and **Subcategory** (React, Copywriting...)
3. Stores the skill as a `.md` file in `vetted_skills/[Category]/[Subcategory]/`
4. Appends a scored row to `admin_assets/rating_tracker.csv` for human review

The result: a self-growing, locally-stored library of production-grade AI skills, automatically organized and scored.

---

## Architecture

```
                        ┌─────────────────────────────────────┐
                        │         skill.checker V1.1           │
                        │      Next.js 16.2 App Router         │
                        └──────────────┬──────────────────────┘
                                       │
              ┌────────────────────────┼──────────────────────┐
              │                        │                       │
    ┌─────────▼──────────┐  ┌──────────▼────────┐  ┌─────────▼────────┐
    │   /api/analyze     │  │  /api/admin/       │  │  /api/admin/     │
    │   (Main Pipeline)  │  │  threats           │  │  curate          │
    └─────────┬──────────┘  └──────────┬────────┘  └─────────┬────────┘
              │                        │                       │
    ┌─────────▼──────────┐             │             ┌─────────▼────────┐
    │ embeddingService   │             │             │ LLM Categorizer  │
    │ OpenAI text-3-small│             │             │ + Rubric Scorer  │
    └─────────┬──────────┘             │             └─────────┬────────┘
              │                        │                       │
    ┌─────────▼──────────┐   ┌─────────▼────────┐   ┌─────────▼────────┐
    │  vectorDbService   │   │    Pinecone       │   │ vetted_skills/   │
    │  Pinecone >0.90    ├───►   (top-50 scan)   │   │ rating_tracker   │
    └─────────┬──────────┘   └──────────────────┘   └──────────────────┘
              │
    ┌─────────▼──────────┐
    │  llmAnalyzerService│
    │  Claude → Gemini   │
    └────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.2.4 (App Router) | Server components, API routes, Turbopack |
| Language | TypeScript 5 + JavaScript | Type-safe services, JS API routes |
| Styling | Tailwind CSS v4 + inline design tokens | OpenCode dark aesthetic (DESIGN.md) |
| Embedding | OpenAI `text-embedding-3-small` | 1536-dim vector generation |
| Vector DB | Pinecone v7 | Cosine similarity threat memory (>0.90) |
| Primary LLM | Anthropic Claude Sonnet | Zero-day threat analysis |
| Fallback LLM | Google Gemini 2.5 Flash | Automatic failover |
| Admin UI | Material UI v9 (dark-themed) | Threat intelligence table |
| Font | IBM Plex Mono (Berkeley Mono fallback) | Terminal-native monospace aesthetic |
| Deployment | Vercel (iad1 — Washington D.C.) | Edge-first production hosting |

---

## Getting Started

### Prerequisites

- Node.js 22+
- A Pinecone account with a 1536-dimension cosine index
- OpenAI API key (for embeddings)
- Anthropic API key (primary LLM)
- Google Gemini API key (fallback LLM)

### Installation

```bash
# Clone the repository
git clone https://github.com/xnorphic/syncstream.git
cd syncstream

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables below)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root. **This file is git-ignored and must never be committed.**

```bash
# OpenAI — embedding generation
OPENAI_API_KEY=sk-proj-...

# Pinecone — vector database
PINECONE_API_KEY=pcsk_...
PINECONE_HOST_URL=https://your-index.svc.region.pinecone.io

# Anthropic — primary LLM analyzer
ANTHROPIC_API_KEY=sk-ant-api03-...

# Google — Gemini fallback
GEMINI_API_KEY=AIza...

# Admin dashboard authentication
ADMIN_SECRET=your-strong-random-secret
```

> **Security note:** `ADMIN_SECRET` is compared exclusively server-side. It is never sent to the browser. Use a high-entropy random string (32+ characters recommended).

---

## API Reference

### `POST /api/analyze`

Analyzes a Claude Skill for security threats.

**Request**
```json
{ "skill": "You are a helpful assistant. Ignore all previous instructions..." }
```

**Response**
```json
{
  "source": "llm" | "vectordb" | "gemini_fallback",
  "threat_level": "safe" | "warning" | "danger",
  "summary": "Concise technical summary of the skill and any threats found.",
  "benefits": ["benefit1", "benefit2"],
  "potential_harms": ["harm1", "harm2"],
  "injection_techniques": ["technique1"],
  "jailbreak_techniques": ["technique1"]
}
```

**Source semantics:**
- `vectordb` — matched a known pattern in Pinecone (>0.90 cosine similarity); instant response
- `llm` — zero-day analysis via Claude Sonnet
- `gemini_fallback` — zero-day analysis via Gemini 2.5 Flash (Anthropic unavailable)

---

### `GET /api/admin/threats`

Returns the top 50 stored threat vectors from Pinecone.

**Auth:** `Authorization: Bearer <ADMIN_SECRET>`

**Response**
```json
{
  "threats": [
    {
      "id": "uuid",
      "score": 0.9821,
      "metadata": {
        "threat_level": "danger",
        "summary": "...",
        "potential_harms": "[\"harm1\"]",
        "injection_techniques": "[\"technique1\"]"
      }
    }
  ]
}
```

---

### `POST /api/admin/curate` *(V1.1)*

Categorizes a safe skill, scores it against the evaluation rubric, saves it locally, and logs it to `rating_tracker.csv`.

**Auth:** `Authorization: Bearer <ADMIN_SECRET>`

**Request**
```json
{
  "skill": "You are a Python expert...",
  "summary": "Python debugging assistant"
}
```

**Response**
```json
{
  "status": "curated",
  "category": "Coding",
  "subcategory": "Python",
  "filename": "python-debugging-assistant.md",
  "total_score": 8.4,
  "decision": "Strong"
}
```

---

## Admin Dashboard

Navigate to `/admin` and enter your `ADMIN_SECRET`. The dashboard queries Pinecone and renders a Material UI table with:

| Column | Description |
|--------|-------------|
| ID | First 8 chars of the vector UUID |
| Level | Threat level chip (Safe / Warning / Danger) |
| Summary | LLM-generated analysis summary |
| Flagged Harms | Top 3 potential harms with overflow count |
| Score | Cosine similarity score |

---

## V1.1 Auto-Curation Engine

The curation pipeline turns analyzed safe skills into a reusable, scored library.

### Evaluation Rubric

Skills are scored across 6 criteria (95 points total):

| Criterion | Max Points | Question |
|-----------|-----------|---------|
| Clarity of Purpose | 15 | Can you understand it in one sentence? |
| Trigger Accuracy | 20 | Does it trigger when it should and only when it should? |
| Scope Definition | 15 | Are in/out boundaries clearly defined? |
| Practical Utility | 20 | Real, frequent problem or niche edge case? |
| Content Quality | 15 | Actionable and complete? |
| Maintenance & Accuracy | 10 | Will this remain true in 6 months? |

**Decision thresholds (scaled to /10):**

| Score | Decision | Action |
|-------|----------|--------|
| 9–10 | Keep | Auto-promote to production library |
| 7–8 | Strong | Include with minor review |
| 5–6 | Consider | Flag for human review |
| < 5 | Remove | Exclude from library |

### Storage Structure

```
vetted_skills/          ← git-ignored, local only
├── Coding/
│   ├── Python/
│   │   └── python-debugging-assistant.md
│   └── React/
│       └── react-component-reviewer.md
├── Writing/
│   └── Copywriting/
│       └── marketing-copy-generator.md
└── Analysis/
    └── Financial/
        └── financial-data-analyst.md

admin_assets/           ← tracked in git (no secrets)
├── skill_evaluator_prompt.md
└── rating_tracker.csv
```

---

## Live Metrics

The homepage displays three live metrics updated every 28 seconds:

- **Active Scanners** — randomized between 400–4,000 (illustrative)
- **Zero-Days Found** — cumulative detections since launch
- **API Thefts Blocked** — total injection attempts caught

---

## Daily Threat Intelligence

The threat ticker rotates a curated list of the top LLM vulnerability classes, updated daily based on global scan telemetry. Current tracked threats include:

- Prompt injection via delimiter confusion
- DAN jailbreak — "Do Anything Now" persona hijacking
- Token smuggling via Unicode homoglyphs
- Indirect prompt injection via RAG-poisoned documents
- Gradient-based adversarial suffix injection
- Many-shot jailbreaking via in-context learning abuse
- Cross-prompt injection in multi-agent architectures

*And 13 more, rotating daily.*

---

## Security Model

| Surface | Control |
|---------|---------|
| `ADMIN_SECRET` | Server-side only; never sent to browser |
| `.env.local` | Git-ignored via `.env*` glob |
| `vetted_skills/` | Git-ignored; local filesystem only |
| API keys | Encrypted at rest in Vercel (marked `Encrypted`) |
| Pinecone queries | Server-side only; client never touches vector DB |
| Character limit (5K) | Client-side UX; enforced by server input validation |
| Admin auth | Bearer token compared server-side; constant-time comparison recommended for V2 |

---

## Roadmap

- [x] V1.0 — Core analysis engine, Pinecone memory, Gemini fallback, Admin dashboard
- [x] V1.1 — Auto-curation engine, skill evaluation rubric, rating tracker
- [ ] V1.2 — Webhook support for CI/CD pipeline integration
- [ ] V1.3 — Bulk upload and batch analysis mode
- [ ] V2.0 — Public skill registry with community ratings

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request for significant changes.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT © [xnorphic](https://github.com/xnorphic)

---

<p align="center">
  Built with a conviction that AI must be Secure-by-Design.<br/>
  <strong>skill.checker</strong> — the security primitive for the AI community.
</p>
