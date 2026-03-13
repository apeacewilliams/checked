# Checked

A full-stack todo app with weather integration. Built with React, Apollo GraphQL, Prisma, and Firebase Auth.

## Tech Stack

| Layer          | Technology                                | Rationale                                                         |
| -------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| Frontend       | React 19 + Vite + TypeScript              | Fast HMR, strict typing                                           |
| Styling        | Tailwind CSS v4 + shadcn/ui (Maia preset) | CSS-variable config, accessible Radix primitives                  |
| GraphQL client | Apollo Client v4                          | Normalised cache, optimistic updates                              |
| Backend        | Apollo Server v5 + Express                | Schema-first GraphQL, easy middleware integration                 |
| Database       | PostgreSQL + Prisma + Neon (prod)         | Type-safe ORM, migrations, serverless Postgres in production      |
| Auth           | Firebase Auth + Firebase Admin SDK        | Handles token issuance; server verifies JWTs                      |
| Weather        | WeatherAPI.com                            | Real-time conditions per city detected in task titles             |
| Cache          | In-memory (dev) / DynamoDB (prod)         | Shared `WeatherCacheInterface` — swap with zero call-site changes |

## Prerequisites

- Node 22 (see `.nvmrc`)
- PostgreSQL (local — see options below)
- Firebase project with Email/Password auth enabled
- WeatherAPI.com key (optional — weather badges are silently disabled without it)
- AWS credentials (optional — app falls back to in-memory weather cache without them)

## Local Database Setup

Pick whichever option suits you:

**Option A — Docker** (recommended, no install needed if Docker Desktop is running)

```bash
docker run --name checked-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=checked \
  -p 5432:5432 -d postgres:17
```

**Option B — Homebrew**

```bash
brew install postgresql@17
brew services start postgresql@17
createdb checked
```

Both options work with the default `DATABASE_URL` in `.env.example`.

## Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd checked
npm install          # installs all workspace dependencies

# 2. Server env
cp .env.example server/.env
# Fill in FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
# (from Firebase console → Project settings → Service accounts → Generate new private key)
# Optionally add WEATHER_API_KEY

# 3. Client env
cp .env.example client/.env
# Fill in VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
# VITE_FIREBASE_APP_ID (from Firebase console → Project settings → Your apps)

# 4. Database
cd server
npx prisma migrate dev   # creates tables + generates Prisma client

# 5. Run
cd ..
npm run dev:server       # starts GraphQL API on :4000
cd client && npm run dev # starts Vite on :5173
```

## Production Database (Neon)

The production database runs on [Neon](https://neon.com) (serverless Postgres). To deploy:

1. Create a Neon project and copy the **pooled** connection string (`-pooler` in the hostname)
2. Set `DATABASE_URL` in your production environment to the Neon URL
3. Run `npx prisma migrate deploy` to apply migrations

## Folder Structure

```
checked/
├── client/src/
│   ├── features/          # vertical slices — each domain owns its components, hooks, api
│   │   ├── authentication/
│   │   ├── tasks/
│   │   ├── weather/
│   │   └── notifications/
│   ├── pages/             # route-level components
│   ├── layout/            # AppShell, Header
│   ├── shared/            # cross-cutting components + hooks
│   └── components/ui/     # shadcn/ui generated components
│
└── server/src/
    ├── graphql/
    │   ├── typeDefs/      # SDL schema files (auto-loaded)
    │   └── resolvers/     # thin resolvers — delegate to services
    ├── services/          # business logic (TaskService, WeatherService, WeatherCache)
    ├── errors/            # typed AppError subclasses
    ├── utils/             # cityDetection (longest-match against ~150 world cities)
    └── config/            # env loading with fail-fast on required vars
```

**Why vertical slicing?** Each feature (tasks, auth, weather) is self-contained. You can delete or replace a feature without touching unrelated code.

**Why hybrid city detection?** A local list of ~150 major cities (sorted longest-first to prefer "new york" over "york") is checked before hitting the API. This avoids false API calls for common words while remaining accurate for real cities.

**Why DynamoDB over in-memory cache?** In-memory cache is lost on server restart. DynamoDB persists across restarts, scales across instances, and handles TTL expiry automatically — no manual cleanup code needed.

## AWS DynamoDB Setup (production)

If you supply `AWS_REGION` + `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`, the server switches to DynamoDB automatically. Create the table once:

1. Go to AWS Console → DynamoDB → Create table
2. **Table name**: match your `DYNAMODB_TABLE_NAME` env var (default: `weather-cache`)
3. **Partition key**: `city` (String)
4. Enable **TTL** on attribute `expiresAt` (DynamoDB → Tables → your table → Additional settings → TTL)

No other configuration needed. The app handles reads, writes, and TTL automatically.

## GraphQL API

Playground available at `http://localhost:4000/graphql` (Apollo Sandbox).

Key operations:

- `tasks(search, tag)` — list tasks with optional filters
- `createTask(input)` — creates task, auto-detects city in title and fetches weather
- `updateTask(id, input)` — updates task, re-detects weather on title change
- `reorderTasks(orderedIds)` — bulk position update (used by drag-and-drop)
- `deleteTask(id)` — hard delete
