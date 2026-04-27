# Restaurant Booking and Review Platform

A web application where users can browse restaurants, make reservations, and read/write reviews. Built as a CSE 412 database course project.

## Tech Stack

- **Database:** PostgreSQL
- **Backend:** Node.js, Express, `pg`, `cors`, `dotenv` (see `backend/`)
- **Frontend:** to be added

## Project Structure

```
restaurant-app/
├── database/        # SQL files (schema, seed data, queries)
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── backend/         # Node.js + Express API (`server.js`, `db.js`, `routes/`)
├── frontend/        # Web client (to be implemented)
├── .gitignore
├── .env.example
└── README.md
```

All PostgreSQL SQL for this project lives in `**database/**`: table definitions (`schema.sql`), demo data (`seed.sql`), and reference queries (`queries.sql`).

## Main Database Tables

- `users` — registered platform users
- `restaurants` — restaurants available for booking/review
- `platforms` — third-party platforms a restaurant is listed on
- `reviews` — user reviews for restaurants
- `reservations` — bookings made by users
- `restaurant_platforms` — junction table linking restaurants and platforms (M:N)

## Setup Plan

1. Install PostgreSQL locally and create a database (e.g. `restaurant_app`).
2. Copy `.env.example` to `.env` and fill in your DB credentials.
3. Run the SQL files in order (when you are ready to load the database):
  ```bash
   psql -U $DB_USER -d $DB_NAME -f database/schema.sql
   psql -U $DB_USER -d $DB_NAME -f database/seed.sql
  ```
4. Start the backend API (from the `backend/` folder — see **Backend setup** below).
5. (Later) Add the frontend in `frontend/`.

## Backend setup

The API lives in `**backend/`**. Environment variables are read from `**backend/.env`** (never commit this file; it is ignored by git via the root `.gitignore`).

1. Open a terminal and go to the backend folder:
  ```bash
   cd backend
  ```
2. If you do not have `package.json` yet, initialize the project (optional if the file is already in the repo):
  ```bash
   npm init -y
  ```
   Then align `package.json` with the repo version (name, scripts, dependencies) or skip this step when cloning from GitHub.
3. Install dependencies:
  ```bash
   npm install
  ```
4. Create your local env file from the example:
  ```bash
   cp .env.example .env
  ```
   Edit `.env` with your real PostgreSQL user, password, database name, and port. Match the database you created for this project.
5. Run the development server (auto-restarts on file changes with Node’s `--watch`):
  ```bash
   npm run dev
  ```
   Or run once without watch:
6. Verify the server:
  - **GET** [http://localhost:3000/](http://localhost:3000/) — JSON welcome payload  
  - **GET** [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db) — confirms PostgreSQL connectivity (requires a running DB and correct `.env`)

**Layout:** `server.js` boots Express and mounts routers under `routes/` (`restaurants`, `users`, `reservations`, `reviews`, `platforms`, `dashboard`). Only health routes are implemented so far; CRUD will be added in `routes/*.js` next.

## Status

Database: `database/schema.sql`, `database/seed.sql`, and `database/queries.sql` are in place. Backend: Express scaffold with DB pool and health endpoints; API CRUD not implemented yet. Frontend: not started.