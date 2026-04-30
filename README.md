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

**[Live Website](https://skill-checker-iota.vercel.app)** · [Admin Dashboard](https://skill-checker-iota.vercel.app/admin) · [Report a Bug](https://github.com/xnorphic/syncstream/issues) · [Request a Feature](https://github.com/xnorphic/syncstream/issues)

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



### 🤖 V1.1 Auto-Curation Engine *(New)*
Safe skills don't disappear after analysis — they enter an automated evaluation pipeline. The `/api/admin/curate` endpoint:

1. Runs the skill through the **Two-Part Skill Evaluation System** (6-criterion rubric, 0–95 points)
2. Categorizes it by **Category** (Coding, Writing, Analysis...) and **Subcategory** (React, Copywriting...)
3. Stores the skill as a `.md` file in `vetted_skills/[Category]/[Subcategory]/`
4. Appends a scored row to `admin_assets/rating_tracker.csv` — Notes column left blank for human review

The result: a self-growing, locally-stored library of production-grade AI skills — automatically organized, scored, and curated.

---

## Architecture

```
                    ┌──────────────────────────────────────┐
                    │         skill.checker  V1.1           │
                    │       Next.js 16.2 App Router         │
                    └──────────────┬───────────────────────┘
                                   │
           ┌───────────────────────┼
           │                       │                       
 ┌─────────▼──────────┐  ┌─────────▼────────┐  
 │   /api/analyze     │  │ /api/admin/       │  
 │   (Main Pipeline)  │  │ threats           │  
 └─────────┬──────────┘  └─────────┬────────┘  
           │                       │                     
 ┌─────────▼──────────┐            │            
 │ embeddingService   │            │            
 │ OpenAI text-3-small│            │            
 └─────────┬──────────┘            │            
           │                       │                     
 ┌─────────▼──────────┐  ┌─────────▼────────┐  
 │  vectorDbService   │  │    Pinecone       │ 
 │  Pinecone >0.90    ├──►  (top-50 scan)   │  
 └─────────┬──────────┘  └──────────────────┘  
           │
 ┌─────────▼──────────┐
 │ llmAnalyzerService │
 │  Claude → Gemini   │
 └────────────────────┘
```

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
| Fallback LLM | Automatic failover |
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
