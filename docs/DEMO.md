# Demo and proof

stackmind is proven with automated installs plus live sample apps under `examples/*_live`.

## Visual demo

Open [demo.html](demo.html) in a browser (or screen record it for social posts).

GitHub file link: https://github.com/mohabdelkarim/stackmind/blob/main/docs/demo.html

## Automated proof

```bash
npm ci
npm run demo_proof
npm run live_smoke
```

This:

1. Runs `stackmind doctor`
2. Inits all stacks (`nextjs`, `python`, `nestjs`, `vue_nuxt`) into temp dirs
3. Inits kits into each `examples/*_live` app
4. Runs smoke checks
5. Writes [PROOF_LOG.md](PROOF_LOG.md)

## Live apps

### Next.js live

```bash
cd examples/nextjs_live
npm install
npm run smoke
npm run build
```

### Python live

```bash
cd examples/python_live
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest
```

### NestJS / Vue Nuxt live

Structure + kit smoke:

```bash
cd examples/nestjs_live && npm run smoke
cd examples/vue_nuxt_live && npm run smoke
```

## Before / after

| Before | After |
|--------|-------|
| Agent invents random folders | Follows kit structure (`app/`, `lib/`, or Nest/Nuxt layouts) |
| Client Components everywhere (Next) | Server Components by default |
| Fat FastAPI routers | Thin `app/api` + `app/services` |
| Unpinned MCP | Pinned `@package@version` in `.cursor/mcp.json` |

## Screen recording tip

1. Open `docs/demo.html`
2. Run `npm run demo_proof` in a terminal beside it
3. Upload the recording to Loom/YouTube and paste the URL below

- Video URL: use `docs/demo.html` + `PROOF_LOG.md` as the current public proof (replace with Loom/YouTube when you upload)
