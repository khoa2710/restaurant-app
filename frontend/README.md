# Restaurant Booking & Review Platform

A full-stack web application for browsing restaurants, making reservations, and leaving reviews.

## Team Members
- Colton Jim
- Khoa Vo
- Kowan Atcitty

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## How to Run

### 1. Start the database
```bash
export PGPORT=8888
export PGHOST=/tmp
pg_ctl -D $HOME/db412 -o "-k /tmp" start
```

### 2. Start the backend
```bash
cd backend
node server.js
```

### 3. Start the frontend
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

## Features
- **Dashboard** — overview of stats including total users, restaurants, reservations, and reviews
- **Restaurants** — browse and search restaurants by name, city, or cuisine type
- **Reservations** — make, edit, cancel, and delete reservations
- **Reviews** — write, edit, and delete reviews with star ratings
- **Users** — view and add users
