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

## Running the Frontend

After building the frontend (`npm run build-frontend` or `npm run build`), you can serve the static files.

```bash
npm run start-frontend
```

The front end expects the backend API URL to be set via an environment variable:
- `VITE_BACKEND_API_URL` – Base URL for the backend API (including `/api`), e.g. `http://localhost:5000/api`.

## Scripts Overview

From the project root:

- `npm run install-all` – Install backend and frontend dependencies.
- `npm run build` – Build both backend and frontend.
- `npm run dev` – Run backend and frontend dev servers concurrently.
- `npm run start-backend` – Start the compiled backend server.
- `npm run start-frontend` – Start the compiled frontend server.
