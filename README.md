# Trump Predictor

**Two terms of precedent. One clear read.**

An open-source AI tool that analyzes how Donald Trump responded to geopolitical and economic events across his two terms — and produces reasoned, evidence-grounded scenario analysis for new situations.

🔗 **Live demo:** [trump-predictor.netlify.app](https://trump-predictor.netlify.app/)

## What it does

Paste a headline or describe a scenario, and Trump Predictor will:

- **Explain the precedent** — how Trump actually moved on trade, security, and diplomacy in comparable past situations, with the documented triggers, decisions, mechanisms, and outcomes.
- **Compare across terms** — e.g. NATO spending rhetoric in Term 1 vs Term 2.
- **Offer a reasoned read** on how he *might* approach a new scenario, grounded in the historical record rather than invented.

Every answer is anchored to a curated dataset of documented decisions, so the tool reasons from evidence instead of hallucinating.

### Example questions

- "How did Trump respond to China tariff escalation in 2018?"
- "Compare his NATO spending rhetoric: term 1 vs term 2."
- "If OPEC cuts production sharply, what pattern might he follow?"
- "What mechanisms did he use for Iran sanctions?"

---

## How it works

Trump Predictor is a **retrieval-grounded** AI application. Rather than fine-tuning a model on Trump's decisions (which would bury the reasoning and prevent citation), it keeps the knowledge in an external, inspectable dataset and grounds every answer in it:

```
User question
      │
      ▼
Find the most relevant documented events   ← curated JSON knowledge base
      │
      ▼
Build a grounded prompt with those events
      │
      ▼
LLM reasons over the retrieved evidence    ← produces cited, pattern-based analysis
      │
      ▼
Answer + the precedents it drew from
```

The core design principle: **the model reasons, the dataset remembers.** This keeps answers traceable to real, documented events and makes the whole knowledge layer open to inspection and improvement.

---

## The dataset

The heart of this project is a curated archive of Trump decisions and reactions across **Term 1 (2017–2021)** and **Term 2 (2025–present)**. Each entry documents:

| Field | Meaning |
|---|---|
| `title`, `category`, `terms` | What it is, its domain (trade / security / diplomacy / economy / …), and which term(s) |
| `triggers` | The geopolitical/economic conditions that prompted the decision |
| `eventSummary` | A neutral summary of what happened |
| `trumpDecision` | The concrete actions taken |
| `trumpResponse` | The rhetorical / public-facing reaction |
| `mechanisms` | The policy levers used (tariffs, sanctions, executive orders, summits, …) |
| `outcomes` | What resulted |
| `keywords`, `sources` | Retrieval hints and citations |

> **On sourcing:** entries are drawn from public reporting and primary documents. Recent, still-developing events are inherently less settled than historical ones — contributions that add citations, correct dates, or flag contested claims are especially welcome (see below).

---

## Tech stack

- **Frontend:** Next.js / React
- **Reasoning layer:** LLM API (grounded, retrieval-augmented prompting)
- **Knowledge base:** curated JSON dataset
- **Hosting:** Netlify

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/hussainabbasss/trump-predictor.git
cd trump-predictor

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# add your API key(s) to .env.local

# 4. Run
npm run dev
```

Then open `http://localhost:3000`.

> You'll need your own LLM API key. See `.env.example` for the required variables.

---

## Contributing

Contributions from researchers, students, and enthusiasts are welcome — this is meant to be a shared resource.

The **highest-value contributions** are to the dataset:

- **Add entries** for documented decisions not yet covered, following the existing schema.
- **Add or correct sources** — every claim should be traceable.
- **Flag contested or developing claims** so the tool can present them with appropriate uncertainty.
- **Improve retrieval and reasoning** in the application layer.

Please keep entries **neutral, documented, and sourced.** The credibility of the whole project rests on the dataset being accurate and evidence-based rather than editorial.

To contribute:

1. Fork the repo
2. Create a branch (`git checkout -b add-xyz-entry`)
3. Make your changes
4. Open a pull request describing what you added or fixed, with sources

---

## Roadmap ideas

- Confidence / "developing story" flags on recent, unsettled entries
- Inline source citations surfaced in the UI
- Retrieval upgrade (semantic search / embeddings) as the dataset grows
- Coverage expansion across more policy domains

---

## License

Released under the [MIT License](LICENSE) — free to use, study, modify, and build on.

---

## Acknowledgements & disclaimer

Built as an open exploration of applied AI and evidence-grounded political analysis.

This project is **not affiliated with, endorsed by, or connected to** Donald Trump, any campaign, or any government entity. All analysis is generated from publicly available information for educational and research purposes. The maintainers make no claim that predictions are accurate representations of future events.
