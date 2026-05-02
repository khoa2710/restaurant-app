# Restaurant Booking and Review Platform

A full-stack web application for browsing restaurants, making reservations, and writing reviews. Built as a CSE 412 database course project.

## Team

- Colton Jim
- Khoa Vo
- Kowan Atcitty

## Tech Stack

- **Database:** PostgreSQL
- **Backend:** Node.js, Express, `pg`, `cors`, `dotenv` (in `backend/`)
- **Frontend:** React + Vite (in `frontend/`)

## Project Structure

```
restaurant-app/
├── database/        # SQL files (schema, seed data, queries)
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── backend/         # Express API (server.js, db.js, routes/, controllers/, middleware/)
│   └── API_DOCUMENTATION.md
├── frontend/        # React + Vite client
├── .gitignore
├── .env.example
└── README.md
```

All PostgreSQL SQL lives in `**database/**`: table definitions (`schema.sql`), demo data (`seed.sql`), and reference queries (`queries.sql`).

## Main Database Tables

- `users` — registered platform users
- `restaurants` — restaurants available for booking/review
- `platforms` — third-party platforms a restaurant is listed on
- `reviews` — user reviews for restaurants
- `reservations` — bookings made by users
- `restaurant_platforms` — junction table linking restaurants and platforms (M:N)

## How to Run

### 1. Database

Install PostgreSQL, create the database, and load the SQL files:

```bash
createdb restaurant_app
psql -U $DB_USER -d restaurant_app -f database/schema.sql
psql -U $DB_USER -d restaurant_app -f database/seed.sql
```

### 2. Backend (terminal 1)

```bash
cd backend
npm install
cp .env.example .env       # edit .env with your real DB credentials
npm run dev                # or: node server.js
```

The API listens on **[http://localhost:3000](http://localhost:3000)**. Sanity check:

- `GET http://localhost:3000/` — JSON welcome payload
- `GET http://localhost:3000/api/test-db` — confirms PostgreSQL connectivity

Full endpoint list: see `backend/API_DOCUMENTATION.md`.

### 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

The UI is served at **[http://localhost:5173](http://localhost:5173)**. It expects the backend at `http://localhost:3000` (override with `VITE_API_URL` if needed).

## Features

- **Dashboard** — totals (users, restaurants, reservations, reviews, average rating, confirmed/cancelled) and a top-rated restaurants table.
- **Restaurants** — browse cards with search by name/city and cuisine filter; restaurant detail page with reviews.
- **Reservations** — list, create, edit, cancel, and delete reservations.
- **Reviews** — list, create, edit, and delete reviews with 1–5 star ratings.
- **Users** — list users and add new users (no password handling — see notes in `backend/API_DOCUMENTATION.md`).

## Status

All three layers (database, backend, frontend) are implemented and integrated. See `backend/API_DOCUMENTATION.md` for the full HTTP contract and `database/queries.sql` for example SQL queries.