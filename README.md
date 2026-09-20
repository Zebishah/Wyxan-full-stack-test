Absolutely — here is a polished **final README** you can use directly.

````md
# The Small Web

The Small Web is a full-stack web application that presents a fictional network of one-page websites through a browser-inspired interface.

Users can browse fictional addresses, follow links, navigate backward and forward, search across page content, view per-person browsing history, and publish new sites.

The project uses:

- **Next.js + TypeScript** for the frontend
- **NestJS + TypeScript** for the API
- **MongoDB Atlas + Mongoose** for persistence
- **pnpm workspaces** for managing the client and server in one repository

---

## Project structure

```text
.
├── client/          # Next.js browser interface
├── server/          # NestJS API
├── scripts/         # Database seed scripts
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
````

The frontend is organized by product feature under:

```text
client/src/features/
```

The backend is organized into feature modules:

```text
server/src/
├── sites/
├── people/
├── visits/
└── search/
```

---

## Requirements

Make sure you have:

- Node.js 20+
- pnpm
- a MongoDB Atlas database

Install pnpm globally if needed:

```sh
npm install -g pnpm
```

---

## Environment setup

Copy the example environment file:

```sh
cp .env.example .env
```

Then update `.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/small-web?retryWrites=true&w=majority

PORT=4000

NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Replace the placeholder MongoDB URI with your own Atlas connection string.

Make sure:

- your Atlas database user has read/write access
- your current IP address is allowed in Atlas Network Access
- the database name is included in the connection URI

Do not commit your real `.env` file or database credentials.

---

## Install dependencies

From the repository root:

```sh
pnpm install
```

This installs dependencies for both the frontend and backend.

---

## Seed the database

Populate MongoDB with the fictional Small Web dataset:

```sh
pnpm seed
```

The seed creates:

- fictional sites
- people
- multiple authors
- links between sites
- intentionally broken links
- per-person browsing history
- repeated visits
- longer browsing trails

The seed is deterministic and idempotent.

Running the seed multiple times does not duplicate the site or person data.

---

## Run the project

Start both the frontend and backend from the repository root:

```sh
pnpm dev
```

The applications will be available at:

```text
Frontend
http://localhost:3001

API
http://localhost:4000
```

Open the frontend at:

```text
http://localhost:3001
```

---

## Full setup from a fresh clone

```sh
git clone <repository-url>
cd Wyxan-full-stack-test

pnpm install

cp .env.example .env
```

Add your MongoDB Atlas connection string to `.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/small-web?retryWrites=true&w=majority
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Then run:

```sh
pnpm seed
pnpm dev
```

Open:

```text
http://localhost:3001
```

---

## Available commands

### Development

```sh
pnpm dev
```

Starts the Next.js frontend and NestJS backend.

### Seed

```sh
pnpm seed
```

Creates the deterministic demo dataset.

### Tests

```sh
pnpm test
```

Runs the project tests, including browser navigation behavior.

### Type checking

```sh
pnpm typecheck
```

Runs TypeScript checks across the workspace.

### Linting

```sh
pnpm lint
```

Runs lint checks.

### Production build

```sh
pnpm build
```

Builds both the frontend and backend.

---

## Browser navigation model

Back and Forward are implemented independently from persistent browsing history.

The frontend keeps an explicit navigation state containing:

```text
entries[]
currentIndex
```

Navigation entries may represent:

- a site
- search results
- an address-not-found state

For example:

```text
Site A → Site B → Site C
                    ↑
               currentIndex
```

Pressing Back moves the current index without deleting entries.

If the user moves Back and then opens a different site:

```text
A → B → C
    ↑

open X
```

the navigation becomes:

```text
A → B → X
```

The old forward branch containing `C` is removed.

This mirrors normal browser behavior.

---

## Restore on return

Each navigation entry stores its scroll position.

Before leaving a page, the browser records the current scroll offset.

When returning through Back or Forward, that position is restored so the user returns to the page they left instead of always starting from the top.

---

## Browsing history

Persistent visit history is stored separately in MongoDB.

A visit contains information such as:

- selected person
- address
- site title
- navigation source
- visit time

The selected person determines whose browsing history receives new visits.

Changing the selected person does not reset the currently displayed site. Subsequent navigation is recorded for the newly selected person.

This separation is intentional:

```text
Browser navigation
→ temporary session state used for Back / Forward

Visit history
→ persistent MongoDB records used by the History view
```

---

## Search

Search operates across:

- site body content
- titles
- addresses

Published HTML is converted into plain text before being stored so page content can be searched without matching HTML tags.

Search results include a short snippet around the matching text.

Search itself is stored as a navigation entry, including its query and result set.

This allows:

```text
Search
→ open result
→ Back
→ same search query and results
```

without running the search again.

---

## Publishing

A new fictional site can be created with:

- author
- address
- title
- HTML content

Addresses are internal identifiers for the Small Web.

Examples:

```text
tidepool.zz
developer.com
notes.local
night-archive.site
my-page
```

These addresses are always treated as fictional internal addresses and are never opened as real internet destinations.

Unsafe URL-like values such as the following are rejected:

```text
https://example.com
javascript:alert(1)
/some/path
```

Duplicate addresses are also rejected.

---

## User-authored HTML security

Published HTML is treated as untrusted input.

The backend sanitizes it using `sanitize-html` before storing it.

Unsafe content such as:

- scripts
- inline JavaScript event handlers
- unsafe URL schemes
- unsupported dangerous markup

is removed.

The sanitized page is then rendered inside a sandboxed iframe:

```html
sandbox="allow-same-origin"
```

The iframe deliberately does not receive permissions for:

- script execution
- forms
- popups
- top-level navigation

This creates an additional isolation boundary between fictional site content and the browser application's own interface.

---

## Fictional links

Links inside fictional sites do not navigate the real browser directly.

The parent application intercepts links inside the iframe.

A link such as:

```html
<a href="observatory.zz">Visit the observatory</a>
```

is routed through the Small Web navigation system.

That means it participates correctly in:

- Back
- Forward
- browsing history
- broken-address handling

Links that do not match the internal fictional-address rules are prevented from escaping the Small Web.

---

## Seed design

The seed contains enough connected data to demonstrate the browser realistically.

It includes:

- roughly ten fictional sites
- meaningful prose instead of placeholder text
- cross-links between sites
- broken links
- several people
- multiple authors
- authors with more than one site
- repeated visits
- long browsing trails
- a person who has visited most of the Small Web

This allows browsing, search, and history to be demonstrated immediately after setup.

---

## Local MongoDB alternative

MongoDB Atlas is the primary database setup.

If you prefer local MongoDB, the repository also includes a Docker Compose service.

Start it with:

```sh
docker compose up -d mongo
```

Then use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/small-web
```

After that:

```sh
pnpm seed
pnpm dev
```

---

## Verification

Before submission, the project can be checked with:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Then run:

```sh
pnpm seed
pnpm dev
```

and open:

```text
http://localhost:3001
```

```

One small recommendation: in `.env.example`, keep only a placeholder Atlas URI, never your real username/password.

(confidence: 99% ± 1%)


is thsi compelte eradme or what??

```
