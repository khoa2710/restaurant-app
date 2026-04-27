# Restaurant Booking and Review Platform

A web application where users can browse restaurants, make reservations, and read/write reviews. Built as a CSE 412 database course project.

## Tech Stack (planned)

- **Database:** PostgreSQL
- **Backend:** Node.js + Express (to be added)
- **Frontend:** to be added

## Project Structure

```
restaurant-app/
├── database/        # SQL files (schema, seed data, queries)
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── backend/         # Node.js + Express API (to be implemented)
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
4. (Later) Set up the Node.js backend in `backend/` and the frontend in `frontend/`.

## Status

Database checkpoint: `database/schema.sql`, `database/seed.sql`, and `database/queries.sql` are in place. Backend and frontend are not implemented yet.