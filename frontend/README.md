# Restaurant Booking & Review Platform — Frontend

React + Vite client for the CSE 412 Restaurant Booking and Review Platform.

## Team

- Colton Jim
- Khoa Vo
- Kowan Atcitty

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Routing:** react-router-dom 7
- **API client:** native `fetch` (see `src/api.js`)

## How to Run

The frontend talks to the backend API. Make sure the backend (and PostgreSQL) are running first — see the root `README.md`.

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

To point the client at a different backend, set `VITE_API_URL` (defaults to `http://localhost:3000`):

```bash
VITE_API_URL=http://localhost:4000 npm run dev
```

## Features

- **Dashboard** — overview of stats (total users, restaurants, reservations, reviews, average rating, confirmed/cancelled) and a top-rated restaurants table.
- **Restaurants** — browse and search by name, city, or cuisine type; restaurant detail page with reviews.
- **Reservations** — make, edit, cancel, and delete reservations.
- **Reviews** — write, edit, and delete reviews with star ratings.
- **Users** — view and add users.
