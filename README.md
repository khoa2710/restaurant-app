# Restaurant Booking and Review Platform

A full-stack web application for browsing restaurants, making reservations, and writing reviews. Built as a CSE 412 database course project.

## Team

- Colton Jim
- Khoa Vo
- Kowan Atcitty

## Demo

- **Video walkthrough:** https://www.youtube.com/watch?v=gEiftjWafLk
- **Repository:** https://github.com/khoa2710/restaurant-app

## Tech Stack

- **Database:** PostgreSQL
- **Backend:** Node.js, Express, `pg`, `cors`, `dotenv` (in `backend/`)
- **Frontend:** React + Vite (in `frontend/`)

## Project Structure

```
restaurant-app/
├── database/
│   ├── schema.sql                  # table definitions
│   ├── seed.sql                    # demo data inserts
│   ├── queries.sql                 # reference SQL queries
│   └── restaurant_app_dump.sql     # pg_dump (schema + data, single file)
├── backend/
│   ├── server.js                   # Express entry
│   ├── db.js                       # pg pool
│   ├── controllers/                # request handlers + SQL
│   ├── routes/                     # thin routers per resource
│   ├── middleware/                 # error handler
│   └── API_DOCUMENTATION.md        # full HTTP contract
├── frontend/                       # React + Vite client
├── .gitignore
├── .env.example
└── README.md
```

## Main Database Tables

- `users` — registered platform users
- `restaurants` — restaurants available for booking/review
- `platforms` — third-party platforms a restaurant is listed on
- `reviews` — user reviews for restaurants
- `reservations` — bookings made by users
- `restaurant_platforms` — junction table linking restaurants and platforms (M:N)

See **`database/`** for table definitions, demo data, reference queries, and a single-file pg_dump that recreates everything.

## How to Run

### 1. Database

Install PostgreSQL, create the database, then load the data. **Recommended path** (single file):

```bash
createdb restaurant_app
psql -U $DB_USER -d restaurant_app -f database/restaurant_app_dump.sql
```

This dump (re)creates all 6 tables and inserts the demo dataset shown in the video (10 users, 10 restaurants, 3 platforms, 15 reservations, 15 reviews, 15 platform mappings).

*Alternative — build from the original SQL files:*

```bash
psql -U $DB_USER -d restaurant_app -f database/schema.sql
psql -U $DB_USER -d restaurant_app -f database/seed.sql
```

Both paths produce the same dataset.

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

Full endpoint list and example bodies: **`backend/API_DOCUMENTATION.md`**.

### 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

The UI is served at **[http://localhost:5173](http://localhost:5173)** and expects the backend at `http://localhost:3000` (override with `VITE_API_URL` if needed).

## Features

- **Dashboard** — totals (users, restaurants, reservations, reviews, average rating, confirmed/cancelled) and a top-rated restaurants table.
- **Restaurants** — browse cards with search by name/city and cuisine filter; restaurant detail page with reviews.
- **Reservations** — list, create, edit, cancel, and delete reservations.
- **Reviews** — list, create, edit, and delete reviews with 1–5 star ratings.
- **Users** — list users and add new users (no password handling — see notes in `backend/API_DOCUMENTATION.md`).

## Submission Artifacts (Phase 3)

- Source code on GitHub (link above).
- Database dump: `database/restaurant_app_dump.sql`.
- API contract: `backend/API_DOCUMENTATION.md`.
- Reference SQL: `database/queries.sql`.
- User manual: submitted separately as a PDF.

## Status

All three layers (database, backend, frontend) are implemented and integrated.
