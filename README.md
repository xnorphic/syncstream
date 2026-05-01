# skill.checker

```
 ░██████╗██╗  ██╗██╗██╗     ██╗      ░██████╗██╗  ██╗███████╗░█████╗░██╗  ██╗███████╗██████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔════╝██╔══██╗
╚█████╗ █████╔╝ ██║██║     ██║     ██║     ███████║█████╗  ██║     █████╔╝ █████╗  ██████╔╝
 ╚═══██╗██╔═██╗ ██║██║     ██║     ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██████╔╝██║  ██╗██║███████╗███████╗╚██████╗██║  ██║███████╗╚██████╗██║  ██╗███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚══════╝╚═╝  ╚═╝
```

> **The AI Security Primitive the Community Has Been Waiting For.**  
> Analyze, score, and optimize Claude Skills with zero-day threat detection and automated safe-skill delivery.

[![Version](https://img.shields.io/badge/version-1.3.0-30d158?style=flat-square&labelColor=201d1d)](https://github.com/xnorphic/syncstream)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-fdfcfc?style=flat-square&labelColor=201d1d)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-007aff?style=flat-square&labelColor=201d1d)](./LICENSE)
[![Live](https://img.shields.io/badge/live-production-30d158?style=flat-square&labelColor=201d1d)](https://skill-checker-iota.vercel.app)

**[Live Website](https://skill-checker-iota.vercel.app)** · [Report a Bug](https://skill-checker-iota.vercel.app/report-bug) · [Request a Feature](https://skill-checker-iota.vercel.app/request-feature)

---

## The Philosophy: Secure-by-Design AI

Every Claude Skill is a system prompt. And every system prompt is a potential attack surface.

Prompt injections are **silent**. Jailbreaks are **evolving daily**. Data exfiltration paths are **invisible to the naked eye**. The AI community has been shipping Skills without a security primitive to evaluate them against — until now.

**skill.checker** is built on a single conviction: **AI systems must be Secure-by-Design, not patched after the fact.** We believe that every prompt entering an AI pipeline should be analyzed for malicious intent *before* it reaches a model. Not as an afterthought. Not as a compliance checkbox. As a first-class engineering concern.

---

## What It Does

### Instant Threat Detection
Paste any Claude Skill (system prompt) and get an immediate security analysis. Known malicious patterns are caught in milliseconds via vector similarity matching. Novel, zero-day threats are analyzed by large language models with automatic failover — zero downtime, zero user friction.

Every result surfaces:
- A threat level: **safe**, **warning**, or **danger**
- A plain-English summary of what the skill does and why it may be risky
- Detected injection and jailbreak techniques
- Intended benefits alongside potential harms

### Skill Optimizer — ROLE / TASK / OUTPUT Rewrite *(V1.3)*
After every analysis, users can request a free optimized version of their skill. The optimizer:

1. Rewrites the prompt using the **ROLE / TASK / OUTPUT** framework — the most effective structure for production AI skills
2. Removes all detected injection techniques, jailbreak vectors, and manipulation surfaces
3. Delivers the result directly to the user's inbox — no account required

### Auto-Curation Engine *(V1.1)*
Safe, high-quality skills don't disappear after analysis. They enter an automated evaluation pipeline using a 6-criterion rubric (Clarity, Trigger Accuracy, Scope, Utility, Content Quality, Maintenance). Skills are scored, categorized, and stored in a structured local library — automatically organized and ready for human review.

### 5,000 Character Limit *(Higher Limits Coming Soon)*
The current version supports up to 5,000 characters per skill. The character counter turns amber at 4,000 and red at 5,000. Paid tiers with expanded limits are in development.

---

## Version History

| Version | Release | What Shipped |
|---------|---------|-------------|
| **V1.3** | May 2026 | Skill Optimizer with ROLE/TASK/OUTPUT rewrite, email delivery via Resend, email lead capture, Supabase data layer for evaluations and feedback |
| **V1.2** | May 2026 | Bug report and feature request pages, SEO metadata, sitemap, robots.txt, geo-aware traffic tracking |
| **V1.1** | Apr 2026 | Auto-curation engine, 6-criterion skill evaluation rubric, rating tracker, Gemini 2.5 Flash fallback |
| **V1.0** | Apr 2026 | Core analysis pipeline, vector threat memory, Admin dashboard |

---

## Roadmap

- [x] V1.0 — Core analysis, vector threat memory, Admin dashboard
- [x] V1.1 — Auto-curation engine, skill evaluation rubric, rating tracker
- [x] V1.2 — Bug/feature pages, SEO & geo optimization, traffic analytics
- [x] V1.3 — Skill Optimizer, email delivery, Supabase data layer
- [ ] V1.4 — Stripe paywall, expanded character limits for paid users
- [ ] V1.5 — Webhook support for CI/CD pipeline integration
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
