# Archi Platform — Frontend (Next.js)

Next.js 16 (App Router) + React 19 + TypeScript frontend for the Archi platform.

## Commands

```bash
# Setup
npm install
cp .env.example .env.local

# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Typecheck
npx tsc --noEmit

# Regenerate the API client from openapi.yaml
npx @rtk-query/codegen-openapi openapi-config.cjs
```

## Notes

- Routes live in `app/`, shared UI in `components/` (shadcn/ui, configured via `components.json`), styling is Tailwind CSS 4.
- Data layer is Redux Toolkit + RTK Query: `services/api.ts` is the hand-written base slice, `services/generatedApi.ts` is generated from `openapi.yaml` — do not edit the generated file by hand; regenerate it instead.
- Forms use react-hook-form + zod resolvers.
- No test runner is configured (no jest/vitest).
