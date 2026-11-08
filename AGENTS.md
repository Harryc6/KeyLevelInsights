# Agent guidance for Key Level Insights

## Learning-first collaboration and planning

- This is the owner's portfolio and learning exercise: taking a full-stack project
  from conception to a functional self-hosted product. Teach, review, guide and
  suggest; do not take over implementation, fix application code for the owner or
  prescribe steps as decisions already made. Explain evidence and tradeoffs so the
  owner can choose, implement and understand the result.
- A request for review, planning or investigation is not permission to implement.
  Explicitly requested documentation and Kan administration are allowed; they do
  not grant blanket permission to fix code or execute ingestion/deployment.
- Kan is the source of truth for agreed scope, priorities, decisions and delivery
  status. Use workspace `Tossu`, board `KLI (Key Level Insights)` (public ID
  `723vwt4r5h6r`). Read the current board before choosing work; do not assume this
  file's planning snapshot supersedes later owner-approved board decisions.
- Distinguish desired capability, committed scope, source inspection and observed
  runtime evidence. Do not mark a card done because code exists or silently narrow
  a requirement when data is unavailable. Record limitations for owner review.

### Maintaining context between sessions

- The owner authorises ongoing Kan administration and periodic updates to this file
  during project sessions; no separate request is needed for each routine update.
  This permission covers planning records and guidance, not application fixes,
  ingestion, database regeneration or deployment.
- Review this guidance after meaningful changes to collaboration preferences or
  durable project constraints, and before ending a session with important new
  context. Update when useful; do not churn the file after every exchange or imply
  that maintenance occurs outside active sessions.
- Keep durable assistant instructions, safety boundaries and concise pointers here.
  Keep detailed requirements, decisions, evidence, priorities and delivery status
  on Kan. Do not mirror card descriptions or turn this file into a second backlog.
- Record settled decisions on Kan without asking the owner to rewrite the
  conversation for administration. Distinguish their decisions from assistant
  proposals and unverified findings; board maintenance does not transfer product
  ownership to the assistant.
- Before adding a handoff note, check whether Kan already preserves it. Prefer a
  card reference over duplication, revise stale notes rather than accumulating
  contradictory history, and never persist secrets, raw personal data or temporary
  tool/session identifiers. Briefly report material guidance or board updates.

### Durable product direction

KLI serves the owner and other Mythic+ players choosing specializations and informing
how to gear/build those characters, using current and historical meta evidence.
It should support a data-backed opinion, not claim that popularity proves optimal
performance. Observed stat distributions are not calculated performance stat weights.
An internal rating/tier system is a possibility, not an agreed method or MVP requirement.

- First release: Blizzard API only. Raider.IO and Warcraft Logs are later
  possibilities, not release dependencies. Scope depends on demonstrated data
  feasibility; no complete historical coverage is promised.
- Preserve representation across all available key levels, with all-specialization
  and like-for-like tank/healer/DPS views, counts and percentage shares. The existing
  `frontend/src/components/SpecFrequencyChart.tsx` is the reference experience;
  elite views supplement it, never replace it.
- Current-build cohorts use the top 1% of observed characters within each specialization,
  scored from their highest observed run score per seasonal dungeon, summed per spec.
  Include cutoff ties; do not estimate missing dungeon results or automatically exclude
  incomplete records that qualify. These are sample-relative character percentiles,
  not run percentiles or official achievement cutoffs. Details belong on TOS-29/TOS-28.
- Composition context, dungeon filtering, talent aggregates and stat distributions
  remain in scope. Standalone dungeon popularity, automatic dungeon-specialist
  highlighting, combat metrics/routes, success-rate views, a separate top-0.1% view
  and direct regional comparison views are deferred. Retain regional metadata.
  Do not reopen these as release-discovery prerequisites; see TOS-29.
- Time exploration centres on week-to-week changes grouped into seasons and
  expansions, with dungeon context and retained regional provenance. Use historical runs actually
  retrievable; prioritise current season/week/recent weeks for builds and stats.
  A current profile is not proof of a build used in a historical run.
  Current builds/gearing and historical trends are distinct product areas; see TOS-29.
  Profile polling frequency is not proof of provider freshness or recent M+ activity.
- Keep sample coverage, counting units, observation time and metric denominators
  explicit. Separate representation from combat performance and causal explanations.
  Do not infer abandoned attempts from missing records, average regional percentiles
  into a worldwide percentile or assume raw key levels are equivalent across seasons.

### Planned stack transition

- The owner intends a modern-Java Spring Boot backend, preferably built with Gradle,
  and confirms Vite+, TypeScript, React and shadcn/ui for the frontend rebuild.
  Vite+ is being evaluated for possible workplace adoption, not already selected there.
  Workplace modularisation and observability goals guide learning, not additional KLI
  SaaS requirements. The first release will use a modular monolith; module boundaries
  and tooling are still to be designed. Logs, metrics and a Grafana dashboard are
  agreed learning outcomes; tracing is not required for the MVP. Details and versions
  belong on TOS-29; do not treat assistant recommendations as owner decisions.
- Teach as an experienced Java 8/Java EE and TypeScript developer, not a programming
  beginner. Modern Java, Spring Boot, Gradle (after Maven), module design and hands-on
  observability need explicit explanation and incremental practice; see TOS-29.
- Preserve agreed product scope and discovery evidence. Existing TypeScript paths
  and commands below describe the current implementation, not the planned stack.
  The rewrite is not permission to scaffold, delete code/data or fix the application.
  Triage old defect cards for reusable acceptance criteria rather than assuming the
  outgoing stack must first be repaired or that its defects are already resolved.

### Planning handoff

The work remains owner-led specification and bounded data discovery, not feature
implementation. Read these cards for the current brief and next work; their live
status and priority belong on Kan, not in this handoff:

1. TOS-29, `Define the Blizzard-first KLI release` (public ID `zep0qg8brtgk`):
   the current release brief, agreed user journey and hosting context, draft
   acceptance criteria and outstanding scope/operating/learning decisions.
2. TOS-28, `Establish Blizzard data feasibility` (public ID `bfrtuow72oiy`):
   investigate in-scope run coverage, character rankings and recent builds/stats;
   preserve deferred findings without reopening them as release prerequisites.
   Record question -> endpoint/sample evidence -> limitations -> feature decision.
   Unsupported results are valid discovery outcomes, not failed implementation.

Keep existing defect and validation cards; relate them to release requirements
rather than duplicating them. Planning priority does not waive deployment safety
gates. This guidance preserves intent between sessions; current decisions and
investigation evidence belong on Kan.

## Code Intelligence

- Prefer native LSP for symbol definitions, references, type information and diagnostics.
- Use IntelliJ MCP for call hierarchies, project structure and IDE inspections.
- Prefer semantic navigation over text searches when investigating code relationships.
- After modifying TypeScript, check relevant LSP diagnostics and run the project's existing type-checking and test commands.
- Do not assume an empty diagnostics result means the entire project compiles successfully.

## Purpose and scope

The existing implementation is a TypeScript application for exploring World of Warcraft
Mythic+ key-level, dungeon and specialization frequencies. It has an Express backend,
PostgreSQL storage, and a React/Vite frontend using Mantine and TanStack Query.

Read [README.md](README.md) for setup and environment documentation. This file maps
implementation boundaries and gives agents project-specific working guidance.
The filename `AGENTS.md` follows the OpenAI Codex convention for repository instructions.

The README names Blizzard, Warcraft Logs and Raider.IO. The scheduled collection path
in `backend/src/services/dataCollectionService.ts` uses Blizzard leaderboards. Warcraft
Logs utilities and a Raider.IO request helper also exist, but their presence does not/
prove complete ingestion or user-facing integrations. Trace the relevant path before
claiming support or extending it.

## Where to make changes

| Area | Location and responsibility |
| --- | --- |
| Server and scheduling | `backend/src/server.ts`: Express setup, `/api` mounts and collection jobs. |
| HTTP API | `backend/src/routes/` defines endpoints; `backend/src/controllers/` parses requests, shapes responses and handles HTTP errors. |
| Collection | `backend/src/services/dataCollectionService.ts`, `connectedRealmService.ts` and `mythicLeaderboadService.ts` collect realm/dungeon leaderboards. The latter filename is spelled this way in the repository. |
| Persistence and reports | `backend/src/services/insertService.ts` writes data; `countKeystoneService.ts` reads aggregated reports; `backend/src/utils/db.ts` owns the PostgreSQL pool. |
| Provider access | `backend/src/utils/bNetQuery.ts`, `wclQuery.ts` and `token.ts`; `backend/src/raiderIO/query.ts`. |
| Data contracts and mappings | `backend/src/types/` contains provider/KLI types and `kli/map.ts` mappings; `backend/src/models/` contains database/report shapes. |
| Frontend routing | `frontend/src/App.tsx` routes Home, Dungeons, Tanks, Healers and Dps pages. |
| Data access and presentation | `frontend/src/hooks/` fetches/query-caches API data; `frontend/src/components/` contains charts and selectors; `frontend/src/pages/` composes views. |
| Deployment | `docker-compose.yml`, `backend/Dockerfile` and `frontend/Dockerfile`. |

Paths shortened within a row are relative to the same directory as that row's first file.

## Data flow and invariants

1. `server.ts` schedules current-period collection hourly and previous-period collection
   on Wednesday at 09:00. Check the scheduler's runtime timezone and regional reset
   assumptions before changing scheduling; starting the backend enables these jobs.
2. Collection fetches connected-realm leaderboards by dungeon/period, deduplicates runs,
   excludes runs with missing specialization IDs, and calculates key-level/spec counts.
3. `insertService.ts` upserts `keystone_frequency` on `(keystone_level, period, dungeon)`.
   Raw `runs` and `characters` are inserted only when `ENVIRONMENT=development`;
   frequency aggregates are stored regardless. `NODE_ENV` does not control this switch.
4. `countKeystoneService.ts` queries aggregates. Frequency controllers cache responses
   for one hour. Routes expose `/api/periods`, `/api/keystone-frequency/:period`,
   `/api/spec-frequency/:period` and `/api/dungeon-frequency/:period`.
   `/api/metadata` exposes the dungeon catalogue and season definitions from `kli/map.ts`,
   serializing open-ended season bounds as `null`; it does not query providers or storage.
5. Frontend hooks call the API through `useFetchData.ts`; TanStack Query feeds chart
   components. For example, `useGetKeystoneFrequency.ts` includes period and dungeon
   in its query key and sends the optional dungeon as a query parameter.
   `ReportPage.tsx` owns shared period/dungeon selection, and `useGetMetadata.ts`
   supplies season labels and pools. Keep catalogue changes in the backend rather
   than reintroducing frontend season maps. Preserve empty states and query-error retry.

Preserve deduplication, repeat-collection semantics, role/spec mappings and period/dungeon
filtering when changing this flow. Keep response types, query keys, transformations and
chart consumers consistent. Inspect historical period assumptions (including period
977 in collection) and dungeon mappings before supporting a new season.

## Commands and prerequisites

Run the following commands from the repository root. There are separate root, backend
and frontend package manifests/lockfiles, not a configured npm workspace.

| Purpose | Command | Notes |
| --- | --- | --- |
| Install root tools | `npm install` | Installs root tools including `concurrently`; not covered by `install-all`. |
| Install app dependencies | `npm run install-all` | Runs installation separately in backend and frontend. |
| Develop both apps | `npm run dev` | Uses root `concurrently` and the two app dev scripts. |
| Develop one app | `npm run dev-backend` / `npm run dev-frontend` | Backend script invokes `nodemon src/server.ts`; frontend invokes Vite. |
| Build both apps | `npm run build` | Backend first, then frontend. |
| Build one app | `npm run build-backend` / `npm run build-frontend` | Backend uses `tsc -p .`; frontend uses `tsc -b && vite build`. |
| Run compiled backend | `npm run start-backend` | Requires `backend/dist/server.js` from a build. |
| Preview built frontend | `npm run start-frontend` | Runs Vite preview, not a production hosting service. |
| Frontend lint | `npm --prefix frontend run lint` | Declared script is `eslint .`; see caveat below. |
| Container setup | `docker compose up --build` | See README and deployment caveats below before running. |

Use the README's Node.js/npm/PostgreSQL prerequisites; Docker builders use Node 22.
Command definitions above are verified against the manifests, not evidence of a passing
build or working deployment. Known setup caveats from repository inspection:

- Backend `dev` invokes `nodemon`, but the backend manifest does not declare `nodemon`
  or `ts-node`. Do not assume development startup works on a clean installation.
- ESLint 9 is declared, while the inspected root configuration is legacy
  `.eslintrc.json` and no frontend flat config is present. The lint script's existence
  is not proof it runs successfully; report configuration failures rather than hiding them.
- None of the three manifests declares a test script. Do not invent `npm test` or claim
  automated test coverage. `backend/sql/001-initial-schema.sql` bootstraps fresh
  PostgreSQL volumes through Compose; existing volumes need the README's manual
  application command. It does not migrate incompatible tables. Use an isolated
  database for write-path smoke checks.

## Configuration and safety

Use `backend/.env.example` and `frontend/.env.example` as templates; never overwrite a
user's existing `.env`. Consult the README for variable details rather than copying
credentials into code, documentation, logs or task comments.

- Backend configuration uses `PORT`, `ENVIRONMENT`, `DB_*`, `BNET_CLIENT_ID`,
  `BNET_CLIENT_SECRET`, `WCL_CLIENT_ID` and `WCL_CLIENT_SECRET`. `DB_SSL` enables SSL
  only when it equals the string `true`.
- `backend/src/utils/token.ts` manages `BNET_*`/`WCL_*` access-token and expiry values
  and writes `.env` relative to the process working directory. Root backend scripts
  run within `backend/`; preserve that working-directory assumption.
- The current token helper also logs the access token. Treat credentialed runtime
  output as sensitive: never paste it unredacted into reports or Kan comments.
- `VITE_BACKEND_API_URL` is public browser configuration and includes `/api`.
  Never put a secret in a `VITE_*` variable. The fetch helper defaults to
  `http://localhost:5000/api` when no URL is supplied.
- Compose supplies `/api` at frontend build time. `frontend/nginx.conf` proxies
  `/api/` to `http://backend:5000` on the Docker network; the browser uses the
  frontend's origin. Rebuild the frontend image after URL or nginx changes.
- Use an isolated development database and authorized credentials for ingestion checks.
  Collection writes data, invokes external services and may refresh/persist tokens.
  Do not run historical backfills or modify production data as an incidental check.

## Coding and verification workflow

- Follow `.prettierrc`: four-space indentation, single quotes, no semicolons,
  120-column print width and ES5 trailing commas. Avoid unrelated formatting changes.
- Both app TypeScript configurations enable strict checking. Backend emits CommonJS;
  frontend uses ES modules. Preserve local import conventions and existing types.
- Keep HTTP concerns in routes/controllers, collection and SQL work in services, and
  frontend fetching in hooks rather than adding a second data-access convention.
- Preserve parameterized SQL values and the existing PostgreSQL pool. Extend Mantine
  components and TanStack Query patterns instead of adding competing UI/state stacks.
- Build the affected app(s). For API/aggregation changes, use a known small dataset and
  check expected counts, duplicate handling, period/dungeon filters and repeated ingestion.
  Account for controller caches when checking newly written data.
- For UI changes, run the frontend against a configured backend and exercise the changed
  chart/filter in a browser, including loading, empty and error states. A successful build
  alone is not evidence of correct data or presentation.
- For documentation-only changes, check referenced paths and commands against the
  repository; do not trigger ingestion just to validate prose.
- Report exactly which checks ran, their results and any unavailable prerequisites.
  Keep setup/behavior documentation aligned with changes, and distinguish observed
  runtime behavior from source-only conclusions. Never mark work complete based solely
  on the presence of source files.
