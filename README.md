# skill.checker

```
 ░██████╗██╗  ██╗██╗██╗     ██╗      ░██████╗██╗  ██╗███████╗░█████╗░██╗  ██╗███████╗██████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
╚█████╗ █████╔╝ ██║██║     ██║     ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
 ╚═══██╗██╔═██╗ ██║██║     ██║     ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██████╔╝██║  ██╗██║███████╗███████╗╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

> **The AI Security Primitive the Community Has Been Waiting For.**  
> Analyze, score, and curate Claude Skills with zero-day threat detection, vector memory, and an automated safe-skill storage engine.

[![Version](https://img.shields.io/badge/version-1.1.0-30d158?style=flat-square&labelColor=201d1d)](https://github.com/xnorphic/syncstream)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-fdfcfc?style=flat-square&labelColor=201d1d)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-007aff?style=flat-square&labelColor=201d1d)](./LICENSE)
[![Live](https://img.shields.io/badge/live-production-30d158?style=flat-square&labelColor=201d1d)](https://skill-checker-iota.vercel.app)

**[Live Website](https://skill-checker-iota.vercel.app)** · [Report a Bug](https://skill-checker-iota.vercel.app/report-bug) · [Request a Feature](https://skill-checker-iota.vercel.app/request-feature)

---

## The Philosophy: Secure-by-Design AI

Every Claude Skill is a system prompt. And every system prompt is a potential attack surface.

Prompt injections are **silent**. Jailbreaks are **evolving daily**. Data exfiltration paths are **invisible to the naked eye**. The AI community has been shipping Skills without a security primitive to evaluate them against — until now.

**skill.checker** is built on a single conviction: **AI systems must be Secure-by-Design, not patched after the fact.** We believe that every prompt entering an AI pipeline should be analyzed for malicious intent *before* it reaches a model. Not as an afterthought. Not as a compliance checkbox. As a first-class engineering concern.

This tool provides three layers of defense:

1. **Instant vector memory** — known malicious patterns caught in milliseconds via Pinecone cosine similarity (>0.90 threshold)
2. **Zero-day LLM analysis** — unknown threats analyzed by Claude Sonnet with automatic Gemini 2.5 Flash fallback
3. **Auto-curation** — safe, high-quality skills automatically categorized, scored on a 6-criterion rubric, and stored in a local vetted library

---

## Top Features

### ⚡ Zero-Day LLM Analysis
The core engine. Every submitted skill is embedded (OpenAI `text-embedding-3-small`, 1536 dimensions) and checked against a Pinecone vector index. On a cache miss, Claude Sonnet analyzes the prompt using a hardened meta-prompt that identifies:

- **Prompt injection techniques** — delimiter confusion, instruction override, indirect injection via RAG-poisoned documents
- **Jailbreaking vectors** — DAN personas, role-play bypasses, Base64 encoding, hypothetical framing, token smuggling
- **Intended benefits** — the constructive, legitimate purpose of the skill
- **Potential harms** — data exfiltration paths, manipulation surface, social engineering risk

Results return as structured JSON: `threat_level`, `summary`, `benefits`, `potential_harms`, `injection_techniques`, `jailbreak_techniques`.

### 🧠 Pinecone Vector Memory
Analyzed skills are embedded and upserted into Pinecone with a cosine similarity threshold of **>0.90**. This creates a persistent threat memory: the second a known-malicious prompt variant appears, it's identified instantly — no LLM call needed. As the index grows, the system becomes faster and smarter. This is the difference between a one-shot scanner and a **living security system**.

### 🔄 Gemini 2.5 Flash Fallback
The LLM pipeline uses a try/catch architecture. Claude Sonnet is the primary analyzer. If Anthropic is unavailable (credit exhaustion, rate limits, regional outages), the system automatically falls back to Google Gemini 2.5 Flash with the identical meta-prompt. The frontend displays `via gemini fallback` transparently. Zero downtime. Zero user friction.

### 📏 5,000 Character Limit *(Higher Limits Coming Soon)*
The current version supports up to 5,000 characters per skill analysis. Skills exceeding this limit trigger a high-visibility alert — the Analyze button is disabled and a "Higher limits coming soon" notice appears. The character counter turns amber at 4,000 and red at 5,000. Enforced both client-side and server-side. Paid tiers with expanded limits are in development.

### 🤖 V1.1 Auto-Curation Engine *(New)*
Safe skills don't disappear after analysis — they enter an automated evaluation pipeline. The `/api/admin/curate` endpoint:

1. Runs the skill through the **Two-Part Skill Evaluation System** (6-criterion rubric, 0–95 points)
2. Categorizes it by **Category** (Coding, Writing, Analysis...) and **Subcategory** (React, Copywriting...)
3. Stores the skill as a `.md` file in `vetted_skills/[Category]/[Subcategory]/`
4. Appends a scored row to `admin_assets/rating_tracker.csv` — Notes column left blank for human review

The result: a self-growing, locally-stored library of production-grade AI skills — automatically organized, scored, and curated.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.2.4 (App Router, Turbopack) | Server components, API routes |
| Language | TypeScript 5 + JavaScript | Type-safe services; JS API routes |
| Styling | Tailwind CSS v4 + design tokens | OpenCode warm-dark aesthetic |
| Embedding | OpenAI `text-embedding-3-small` | 1536-dim vector generation |
| Vector DB | Pinecone v7 | Cosine similarity threat memory |
| Primary LLM | Anthropic Claude Sonnet | Zero-day threat analysis |
| Fallback LLM | Google Gemini 2.5 Flash | Automatic failover |
| Admin UI | Material UI v9 (dark-themed) | Threat intelligence table |
| Font | IBM Plex Mono / Berkeley Mono | Terminal-native monospace aesthetic |
| Deployment | Vercel (iad1 — Washington D.C.) | Edge-first production hosting |

---

## Getting Started

### Prerequisites

- Node.js 22+
- A Pinecone account with a 1536-dimension cosine index
- OpenAI API key (embeddings)
- Anthropic API key (primary LLM)
- Google Gemini API key (fallback LLM)

### Installation

```bash
git clone https://github.com/xnorphic/syncstream.git
cd syncstream
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` in the project root — **git-ignored, never commit this file.**

```bash
OPENAI_API_KEY=sk-proj-...
PINECONE_API_KEY=pcsk_...
PINECONE_HOST_URL=https://your-index.svc.region.pinecone.io
ANTHROPIC_API_KEY=sk-ant-api03-...
GEMINI_API_KEY=AIza...
ADMIN_SECRET=your-strong-random-secret-32-chars-min
```

---

## API Reference

### `POST /api/analyze`

**Request**
```json
{ "skill": "You are a helpful assistant..." }
```

**Response**
```json
{
  "source": "llm | vectordb | gemini_fallback",
  "threat_level": "safe | warning | danger",
  "summary": "...",
  "benefits": ["..."],
  "potential_harms": ["..."],
  "injection_techniques": ["..."],
  "jailbreak_techniques": ["..."]
}
```

---

### `GET /api/admin/threats`

**Auth:** `Authorization: Bearer <ADMIN_SECRET>`

Returns top-50 Pinecone matches (threat metadata, scores, summaries).

---

### `POST /api/admin/curate` *(V1.1)*

**Auth:** `Authorization: Bearer <ADMIN_SECRET>`

**Request**
```json
{ "skill": "You are a Python expert...", "summary": "Python debugging assistant" }
```

**Response**
```json
{
  "status": "curated",
  "category": "Coding",
  "subcategory": "Python",
  "filename": "python-debugging-assistant-1234567890.md",
  "total_score": 8.4,
  "decision": "Strong"
}
```

---

## V1.1 Skill Curation Engine

### Evaluation Rubric

| Criterion | Max Pts | Question |
|-----------|---------|---------|
| Clarity of Purpose | 15 | Can you understand it in one sentence? |
| Trigger Accuracy | 20 | Does it trigger when and only when it should? |
| Scope Definition | 15 | Are in/out boundaries clearly defined? |
| Practical Utility | 20 | Real, frequent problem or niche edge case? |
| Content Quality | 15 | Actionable and complete? |
| Maintenance & Accuracy | 10 | Will this remain valid in 6 months? |
| **Total** | **95** | Scaled to /10 |

**Decision thresholds:** `9–10 = Keep` · `7–8 = Strong` · `5–6 = Consider` · `<5 = Remove`

### Storage Structure

```
vetted_skills/           ← git-ignored, local only
├── Coding/Python/
├── Writing/Copywriting/
└── Analysis/Financial/

admin_assets/            ← tracked in git (no secrets)
├── skill_evaluator_prompt.md
└── rating_tracker.csv
```

---

## Security Model

| Surface | Control |
|---------|---------|
| `ADMIN_SECRET` | Server-side only — never sent to browser |
| `.env.local` | Git-ignored via `.env*` glob |
| `vetted_skills/` | Git-ignored — local filesystem only |
| API keys | Encrypted at rest in Vercel |
| Pinecone access | Server-side only — client never touches vector DB |
| Character limit | Client UX enforced by server input validation (paid tiers coming soon) |

---

## Roadmap

- [x] V1.0 — Core analysis, Pinecone memory, Gemini fallback, Admin dashboard
- [x] V1.1 — Auto-curation engine, skill evaluation rubric, rating tracker
- [ ] V1.2 — Webhook support for CI/CD pipeline integration
- [ ] V1.3 — Bulk upload and batch analysis mode
- [ ] V2.0 — Public skill registry with community ratings

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: your feature'`
4. Push and open a Pull Request

---

## License

MIT © [xnorphic](https://github.com/xnorphic)

---

<p align="center">
  Built with a conviction that AI must be Secure-by-Design.<br/>
  <strong>skill.checker</strong> — the security primitive for the AI community.
</p>
