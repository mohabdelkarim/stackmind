# Eval harness

Deterministic coverage checks that each kit contains the guidance needed for fixed prompts.

```bash
npm run eval
```

- `cases/*.json` — prompt + `must_contain` needles (empty corpus must miss; kit corpus must hit)
- `fixtures/*.md` — human readable before/after behavior notes for demos

This does not call an LLM. It proves the kit text is present and useful for scoring agent behavior offline.
