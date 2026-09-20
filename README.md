# The Small Web

The Small Web is a normal web application that presents a fictional network of one-page sites through a small, browser-inspired shell. It uses Next.js and TypeScript for the interface, NestJS and Mongoose for the API, and MongoDB for sites, people, and per-person visits.

The repository is intentionally small and direct:

- `client/` — the Next.js browser UI, organized by product feature under `client/src/features/`.
- `server/` — the NestJS API, organized into the `sites`, `people`, `visits`, and `search` modules.
- `scripts/` — operational scripts, including deterministic database seeding.

## Run it

Requirements: Node 20+, pnpm, and MongoDB. The included MongoDB service can be started with:

```sh
docker compose up -d mongo
pnpm install
pnpm seed
pnpm dev
```

The browser is available at `http://localhost:3001`; the API listens on `http://localhost:4000`. Copy `.env.example` to `.env` when running against different services.

Useful commands are `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Engineering notes

The back/forward stack is an explicit reducer in `client/src/features/browser/navigation`. Entries are typed as site, search, or not-found entries and contain their rendered snapshot plus scroll position. New navigation truncates the forward branch; visit history is stored separately in MongoDB and is never used to implement browser navigation. Search entries retain their query and result set, so opening a result and pressing Back returns to the results.

Site HTML is sanitized at publish time with `sanitize-html`: scripts, event-handler attributes, and unsafe URL schemes are removed, while ordinary markup and inline styling remain available. The frontend renders the result in an iframe with `sandbox="allow-same-origin"` and deliberately does not grant script, form, popup, or top-navigation capabilities. The parent attaches click handlers to the contained document and only routes addresses matching the fictional internal-address format; all other links are prevented. This gives the little sites their own CSS/document boundary while keeping fictional navigation under application control. The tradeoff is that authors cannot use scripts or working forms, and page markup is normalized before storage.

The seed is deterministic and idempotent: sites and people are upserted by their stable addresses/slugs and seeded visits are recreated on each run. It includes cross-links, broken links, multiple authors, repeated visits, and a long browsing trail.
