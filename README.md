# Key Level Insights

Key Level Insights is a full-stack TypeScript project for tracking and visualizing Mythic+ dungeon performance statistics pulled from Blizzard, Warcraft Logs & Raider.io. It consists of an Express/Node backend and a React/Vite frontend.

## Project Structure

This is a monorepo with two main packages:
- `backend` – Express server that periodically ingests data from Blizzard & Warcraft Logs, handles the rest API for data retrieval and persistence to Postgres.
- `frontend` – React + Vite application (Mantine UI) for exploring dungeon and key-level performance metrics.

## Prerequisites

- Node.js (LTS) and npm
- A PostgreSQL database
- Blizzard API credentials (for the backend to fetch data)
- Warcraft Logs API credentials (for the backend to fetch data)

## Installation

From the project root:

```bash
npm run install-all
```

This installs dependencies for both `backend` and `frontend`. You can also install them separately:

```bash
npm run install-backend
npm run install-frontend
```

## Development

To run backend and frontend together with live reload:

```bash
npm run dev
```

- Backend dev server: `npm run dev-backend`
- Frontend dev server: `npm run dev-frontend`

## Building for Production

```bash
npm run build
```

This runs the `build` scripts in both `backend` and `frontend`.

## Running the Backend

After building the backend (`npm run build-backend` or `npm run build`), start the API server:

```bash
npm run start-backend
```

The backend expects environment variables for database connection and API access. Variables include:

- `PORT` – Port for the Express server (defaults to `5000` if not set).
- `ENVIRONMENT` – Application environment flag used by the data collection service; when set to `development`, additional character and run data is inserted.
- `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_SSL` – PostgreSQL connection details. `DB_SSL` should be set to `'true'` to enable SSL.
- `BNET_CLIENT_ID` / `BNET_CLIENT_SECRET` – Blizzard (Battle.net) API credentials.
- `WCL_CLIENT_ID` / `WCL_CLIENT_SECRET` – Warcraft Logs API credentials.
- `BNET_ACCESS_TOKEN` / `BNET_TOKEN_EXPIRY` / `WCL_ACCESS_TOKEN` / `WCL_TOKEN_EXPIRY` – Access token & expiry for Blizzard and Warcraft Logs APIs. These are managed automatically by the backend token utilities and persisted to the backend `.env` file; you normally do not need to set them manually.

### Blizzard collection failures

Startup currently launches `updateAllExpansionsRuns()` in addition to the scheduled
collection jobs. A failed startup backfill is logged and stopped without terminating
the HTTP server; it does not automatically resume historical periods.

Blizzard requests share a limiter with at most four in-flight jobs and at least
100 ms between job starts. Each HTTP attempt times out after 30 seconds. HTTP
429, 500, 502, 503 and 504, plus transient connection/timeout errors, get up to
three total attempts with exponential backoff and jitter. `Retry-After` seconds
and HTTP dates are respected. A 429 also pauses queued requests for at least five
seconds. Other HTTP errors, including 401, 403 and 404, fail immediately rather than
being treated as empty leaderboards.

Collection waits for each regional batch to settle before deciding whether its
dungeon-period can be saved. A narrow exception allows sparse historical backfills
to continue: when **every realm in a non-empty regional batch returns HTTP 404** and
the requested period is **older than the current period**, the entire dungeon-period
is reported as unavailable and skipped. No runs, characters or frequency aggregates
are written for it, including results already fetched from other regions. Existing
data is not cleared and the gap is not represented as zero runs.

Each skipped dungeon-period emits one warning with its region, realm count and an
example URL instead of repeating every realm error. Collection continues with the
next dungeon and period. `collectAndStoreRuns(period)` returns the unavailable
entries (`region`, `dungeon`, `period`, `realmCount`, `exampleUrl`);
`updateAllExpansionsRuns()` returns the combined entries and logs a final gap count.
These reports are not a persistent resume checkpoint; a later backfill retries the
same targets rather than permanently excluding a dungeon.

Current/future-period 404s, mixed success/404 batches, mixed 404/other-error batches,
authentication failures, exhausted transient retries and malformed responses still
stop collection before saving the affected dungeon-period. Earlier completed
dungeon-periods remain stored. After checking the season mapping/provider availability,
rerun `collectAndStoreRuns(period)` for the reported period or restart the backfill.
Uniform 404s establish unavailable URLs, not a confirmed season boundary or zero runs.

Dungeon selection still uses the season/period mappings in `backend/src/types/kli/map.ts`.
A persistent 500 alone does not distinguish a Blizzard outage from unavailable
historical data or a mapping problem; no alternate dungeon or period is substituted.
An empty successful leaderboard and a failed request remain distinct. A successful
response must identify the requested period, dungeon (`map_challenge_mode_id`) and
connected-realm URL. With that metadata, an omitted `leading_groups` is normalized
to `[]`; populated realms in the same collection are still counted. Explicit `null`
or non-array groups, missing/mismatched metadata, and HTTP failures are not treated
as empty leaderboards.

If a dungeon-period has no eligible runs after deduplication and specialization
filtering, collection logs that outcome and continues to the next dungeon/period
without issuing inserts or clearing existing data. This also avoids an invalid
empty frequency insert. An empty realm does not establish a season-wide data gap.

Run the isolated collection/request regressions from the repository root:

```bash
npm run build-backend
node --test backend/tests/*.test.cjs
```

These checks use a local HTTP fixture and in-memory persistence substitutes, not
Blizzard credentials or a PostgreSQL database.

## Running the Frontend

After building the frontend (`npm run build-frontend` or `npm run build`), you can serve the static files.

```bash
npm run start-frontend
```

The front end expects the backend API URL to be set via an environment variable:
- `VITE_BACKEND_API_URL` – Base URL for the backend API (including `/api`), e.g. `http://localhost:5000/api`.

### Report Data and Seasons

The frontend loads `/api/periods` for the periods with collected data and
`/api/metadata` for the dungeon catalogue and season definitions. Metadata is derived
from `backend/src/types/kli/map.ts`; there is no separate frontend dungeon pool to
update. Its response contains:

- `dungeons`: `{ id, name }` entries.
- `seasons`: `{ id, name, firstPeriod, lastPeriod, dungeonIds }` entries.
  An open-ended `lastPeriod` is serialized as `null`, not `Infinity`.

Period labels show the configured season, week relative to `firstPeriod`, and period
ID. The newest collected period is marked **Latest available**, which does not claim
that collection is current. Dungeon filters use the selected season's pool; switching
periods preserves a selected dungeon only if it belongs to the destination pool.
Unknown periods retain all-dungeon reports without inventing a season or dungeon pool.
Unknown dungeon IDs in reports are displayed as `Dungeon <id>`.

The Home, Dungeons, Tanks, Healers and DPS reports support empty datasets, loading
indicators and retryable request errors. Specialization bars show shares within the
selected role, with raw counts in tooltips. Charts resize to the available width.

Deploy the metadata endpoint and its frontend consumer together:

```bash
docker compose up -d --build backend frontend
```

This recreates services as needed. Backend startup follows `server.ts`, including any
enabled startup collection and scheduled jobs; do not use it as an incidental read-only
check against a production database.

## Scripts Overview

From the project root:

- `npm run install-all` – Install backend and frontend dependencies.
- `npm run build` – Build both backend and frontend.
- `npm run dev` – Run backend and frontend dev servers concurrently.
- `npm run start-backend` – Start the compiled backend server.
- `npm run start-frontend` – Start the compiled frontend server.

## Running with Docker

This repository includes Dockerfiles for both the backend and frontend, plus a `docker-compose.yml` that wires everything together with PostgreSQL.

### Prerequisites

- Docker
- Docker Compose (or `docker compose` with recent Docker versions)

### Build and Run

From the project root:

```bash
docker compose up --build
```

This will:
- Start a PostgreSQL container named `kli_db` (Compose service `db`).
- Build and start the backend on `http://localhost:5000`.
- Build and start the frontend on `http://localhost:8080`.

The frontend is built with `VITE_BACKEND_API_URL=/api`. The browser requests the API on
the same origin as the frontend (for example, `http://localhost:8080/api/periods`).
The frontend's nginx forwards `/api/` requests to `http://backend:5000` over the Docker
network, preserving the `/api/` prefix and query string. Only nginx resolves the
Docker service name; the browser does not. `frontend/nginx.conf` also serves
`index.html` for client-side routes such as `/dungeons`, so direct links and refreshes work.

The backend connects to the `db` service using the credentials defined in
`docker-compose.yml`. Its published port `5000` is retained for direct debugging but
is not required by the frontend proxy.

After changing the frontend build arguments or nginx configuration, rebuild and
recreate only the frontend while the backend is running:

```bash
docker compose up -d --build --no-deps frontend
```

Vite embeds the API URL at build time; restarting an existing container is not enough.
For a VM deployment, the browser uses the frontend's hostname with the same `/api`
path, without needing the Docker service name or a hardcoded VM address in the bundle.

### Database Schema

`backend/sql/001-initial-schema.sql` reconstructs a schema compatible with the
backend's current SQL and types; it is not a recovered copy of the original database.
It creates:

- `keystone_frequency`: per-key-level, period and dungeon aggregates, with a primary
  key matching the collector's upsert and an index for period/dungeon reports.
- `characters`: character/specialization pairs, deduplicated by their composite key.
- `runs`: raw runs with JSONB party members and a unique constraint matching the
  existing run-insertion conflict target. Completion timestamps are stored as
  millisecond integers, not SQL timestamps.

Compose mounts this file into PostgreSQL's `/docker-entrypoint-initdb.d/` directory.
PostgreSQL applies it automatically **only when initializing an empty data directory**.
The backend waits for the database health check before starting.

For an existing database volume missing the application tables, apply it manually
from the repository root while `db` is running:

```bash
docker compose exec -T db sh -c \
    'exec psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --set=ON_ERROR_STOP=1' \
    < backend/sql/001-initial-schema.sql
```

For PostgreSQL outside Compose, apply the same file with `psql --set=ON_ERROR_STOP=1
--file=backend/sql/001-initial-schema.sql` using your database connection settings.
The SQL is transactional and can be reapplied to this schema without deleting data.
`IF NOT EXISTS` does not repair incompatible existing tables; schema changes to those
tables require a separate migration. Do not delete the database volume to rerun setup.

Outside Compose, use `psql --set=ON_ERROR_STOP=1
--file=backend/sql/002-add-devourer.sql` with your database connection settings.
The migration is transactional and safe to reapply; existing rows receive a zero
Devourer count without changing other counts. It does not recover historical data.
Re-ingest affected periods (for example, `collectAndStoreRuns(1070)`) or let the
startup backfill revisit them to replace their frequency aggregates. Cached report
responses can remain stale for up to one hour after re-ingestion.

If raw storage is enabled with `ENVIRONMENT=development`, older run parties already
omitted Devourer members. Those rows are not repaired in place: party JSON is part
of the raw-run uniqueness constraint, so corrected parties can coexist with old
incomplete rows. Frequency reports use the upserted aggregates, not those raw rows;
do not rely on the old raw parties alone to reconstruct missing Devourer counts.

Initialization creates tables, not historical data. Without a backup, lost historical
data is not restored. Empty databases return `[]` from the periods and frequency
endpoints. Collection requires provider credentials and season/period mappings
appropriate for the data being collected; schema initialization does not run it.
Raw runs and characters are stored only with `ENVIRONMENT=development`; aggregates
are stored regardless. API responses, including empty results, are cached for up to
one hour, so newly collected data may not appear immediately.

### Environment & Secrets

The compose file sets basic database credentials for local development. For real deployments:
- Override database credentials and connection details using `env_file` or environment variables.
- Provide `BNET_*` and `WCL_*` API credentials via environment variables rather than committing them to source.
