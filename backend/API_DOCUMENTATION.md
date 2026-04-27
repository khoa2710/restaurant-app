# Restaurant Booking and Review Platform — API Documentation

REST API for the CSE 412 Restaurant Booking and Review Platform.

- **Base URL:** `http://localhost:3000`
- **Stack:** Node.js, Express, PostgreSQL (`pg`)
- **Content type:** `application/json` for all `POST`, `PUT`, `PATCH` requests

## Conventions

- All `:id` parameters are positive integers. Non-numeric IDs return `400`.
- Errors return JSON: `{ "error": "Human readable message", "message": "optional detail" }`.
- Success responses return JSON. List endpoints return arrays; single-resource endpoints return objects.
- The schema uses identity columns; **never send** `user_id`, `restaurant_id`, `review_id`, or `reservation_id` in `POST` request bodies for the resource being created (foreign-key references like `user_id` in a review/reservation body are still required).

## Health checks

| Method | Endpoint        | Purpose                          | Success | Errors  |
|--------|-----------------|----------------------------------|---------|---------|
| GET    | `/`             | Service info + endpoint listing  | `200`   | —       |
| GET    | `/api/test-db`  | Verify PostgreSQL connectivity   | `200`   | `503`   |

---

## Restaurants

| Method | Endpoint                          | Purpose                                                      | Success | Errors                |
|--------|-----------------------------------|--------------------------------------------------------------|---------|-----------------------|
| GET    | `/api/restaurants`                | List all restaurants with `average_rating`                   | `200`   | `500`                 |
| GET    | `/api/restaurants/:id`            | Single restaurant + `average_rating` and `review_count`      | `200`   | `400`, `404`, `500`   |
| GET    | `/api/restaurants/:id/reviews`    | All reviews for a restaurant (joined with users)             | `200`   | `400`, `404`, `500`   |

**Example response — `GET /api/restaurants`** (one item shown):

```json
{
  "restaurant_id": 1,
  "name": "Pitch Forks",
  "address": "123 Main St",
  "city": "Tempe",
  "cuisine_type": "Variety of cuisines",
  "price_range": "$$",
  "phone": "4801111111",
  "hours": "10:00 AM - 9:00 PM",
  "average_rating": "4.50"
}
```

**Frontend notes**

- `average_rating` is a string (Postgres `NUMERIC`) and may be `null` if the restaurant has no reviews. Coerce with `Number(...)` before formatting; show "No reviews yet" when `null`.
- `GET /api/restaurants/:id` is the recommended call for a restaurant detail page (returns `review_count` too).
- Use `GET /api/restaurants/:id/reviews` to populate the reviews list on that detail page; the response shape matches `GET /api/reviews`.

---

## Users

| Method | Endpoint        | Purpose                                | Success | Errors                       |
|--------|-----------------|----------------------------------------|---------|------------------------------|
| GET    | `/api/users`    | List all users (no `password_hash`)    | `200`   | `500`                        |
| POST   | `/api/users`    | Create a user                          | `201`   | `400`, `409`, `500`          |

**Example response — `GET /api/users`** (one item shown):

```json
{
  "user_id": 1,
  "name": "Colton Jim",
  "email": "asurite1@asu.edu",
  "phone": "4801234567",
  "created_at": "2026-04-27T22:38:27.062Z"
}
```

**Example request body — `POST /api/users`**

```json
{
  "name": "Test User",
  "email": "test.user@example.com",
  "phone": "5551234567"
}
```

**Frontend notes**

- `GET /api/users` **never** returns `password_hash`.
- `POST /api/users` **does not accept** a `password` field. Real authentication (bcrypt/argon2) is out of scope for Phase 3, so the server stores `'pending_password_setup'` in `password_hash` for any user created via the API.
- `phone` is optional; pass `null` or omit it.
- `email` must be unique. Duplicate email returns `409`.
- Validation errors (missing `name`, missing or malformed `email`) return `400` with a readable message.

---

## Reservations

| Method | Endpoint                                 | Purpose                                            | Success | Errors                |
|--------|------------------------------------------|----------------------------------------------------|---------|-----------------------|
| GET    | `/api/reservations`                      | List reservations w/ user + restaurant names       | `200`   | `500`                 |
| POST   | `/api/reservations`                      | Create a reservation                               | `201`   | `400`, `500`          |
| PUT    | `/api/reservations/:id`                  | Full update of editable fields                     | `200`   | `400`, `404`, `500`   |
| PATCH  | `/api/reservations/:id/cancel`           | Set `status='cancelled'`                           | `200`   | `400`, `404`, `500`   |
| DELETE | `/api/reservations/:id`                  | Delete a reservation                               | `200`   | `400`, `404`, `500`   |

**Example response — `GET /api/reservations`** (one item shown):

```json
{
  "reservation_id": 1,
  "user_id": 1,
  "user_name": "Colton Jim",
  "restaurant_id": 1,
  "restaurant_name": "Pitch Forks",
  "reservation_date": "2026-04-01T07:00:00.000Z",
  "reservation_time": "19:00:00",
  "party_size": 4,
  "status": "confirmed",
  "created_at": "2026-04-27T22:38:27.074Z"
}
```

**Example request body — `POST /api/reservations`**

```json
{
  "user_id": 1,
  "restaurant_id": 2,
  "reservation_date": "2026-06-01",
  "reservation_time": "18:30",
  "party_size": 3,
  "status": "pending"
}
```

`reservation_id` is auto-generated by the database. Do **not** include it in the request body.

**Example request body — `PUT /api/reservations/:id`**

```json
{
  "reservation_date": "2026-06-02",
  "reservation_time": "19:00",
  "party_size": 4,
  "status": "confirmed"
}
```

This is a **full update** of the editable fields. All four fields are required. `user_id` and `restaurant_id` cannot be changed via this endpoint.

**Example request — `PATCH /api/reservations/:id/cancel`**

No request body. The server sets `status` to `cancelled` and returns the updated reservation.

**Example response — `DELETE /api/reservations/:id`**

```json
{ "ok": true, "deleted_reservation_id": 17 }
```

**Frontend notes / validation**

- `party_size` must be an integer **greater than 0** (validated server-side; matches schema CHECK).
- `status` must be one of: `pending`, `confirmed`, `cancelled`, `completed`. Other values return `400`.
- `reservation_date` format: `YYYY-MM-DD` (e.g. `2026-06-01`).
- `reservation_time` format: `HH:MM` or `HH:MM:SS` (24-hour).
- Invalid `user_id` or `restaurant_id` (foreign-key violation) returns `400` with the offending key in `message`.
- `PUT`, `PATCH`, and `DELETE` return `404` when no reservation matches the id.

---

## Reviews

| Method | Endpoint                  | Purpose                                          | Success | Errors                |
|--------|---------------------------|--------------------------------------------------|---------|-----------------------|
| GET    | `/api/reviews`            | List reviews w/ user + restaurant names          | `200`   | `500`                 |
| POST   | `/api/reviews`            | Create a review                                  | `201`   | `400`, `500`          |
| PUT    | `/api/reviews/:id`        | Full update of a review                          | `200`   | `400`, `404`, `500`   |
| DELETE | `/api/reviews/:id`        | Delete a review                                  | `200`   | `400`, `404`, `500`   |

**Example response — `GET /api/reviews`** (one item shown):

```json
{
  "review_id": 1,
  "user_id": 1,
  "user_name": "Colton Jim",
  "restaurant_id": 1,
  "restaurant_name": "Pitch Forks",
  "rating": "4.5",
  "comment": "Dining hall food was great!",
  "review_date": "2026-03-01T07:00:00.000Z",
  "source_platform": "Yelp"
}
```

**Example request body — `POST /api/reviews`**

```json
{
  "user_id": 1,
  "restaurant_id": 2,
  "rating": 4.5,
  "comment": "Great food and service.",
  "review_date": "2026-04-27",
  "source_platform": "Yelp"
}
```

`review_id` is auto-generated. `comment` and `source_platform` are optional.

**Example request body — `PUT /api/reviews/:id`**

```json
{
  "rating": 5,
  "comment": "Updated review after a second visit.",
  "review_date": "2026-04-28",
  "source_platform": "Google"
}
```

**Example response — `DELETE /api/reviews/:id`**

```json
{ "ok": true, "deleted_review_id": 17 }
```

**Frontend notes / validation**

- `rating` must be a **number between 1 and 5** (inclusive). Out-of-range values return `400`.
- `rating` is returned as a string (`NUMERIC(2,1)`); coerce with `Number(rating)` for star UI math.
- `review_date` format: `YYYY-MM-DD`.
- Invalid `user_id` or `restaurant_id` (foreign-key violation) returns `400`.
- `PUT` and `DELETE` return `404` when no review matches the id.

---

## Platforms

| Method | Endpoint                       | Purpose                                                          | Success | Errors  |
|--------|--------------------------------|------------------------------------------------------------------|---------|---------|
| GET    | `/api/platforms`               | List all platforms (Yelp, Google, TripAdvisor)                   | `200`   | `500`   |
| GET    | `/api/restaurant-platforms`    | List `restaurant_platforms` rows joined with names               | `200`   | `500`   |

**Example response — `GET /api/platforms`**

```json
[
  { "platform_id": 2, "platform_name": "Google",      "api_url": "https://maps.googleapis.com" },
  { "platform_id": 1, "platform_name": "Yelp",        "api_url": "https://api.yelp.com" },
  { "platform_id": 3, "platform_name": "TripAdvisor", "api_url": "https://api.tripadvisor.com" }
]
```

**Example response — `GET /api/restaurant-platforms`** (one item shown):

```json
{
  "restaurant_id": 1,
  "restaurant_name": "Pitch Forks",
  "platform_id": 1,
  "platform_name": "Yelp",
  "external_restaurant_id": "yelp_pitch_forks_001"
}
```

**Frontend notes**

- Use `GET /api/restaurant-platforms` to show "Listed on Yelp / Google / TripAdvisor" badges on a restaurant card.
- The platform list is small and stable; cache it client-side after the first call.

---

## Dashboard

| Method | Endpoint                  | Purpose                                              | Success | Errors  |
|--------|---------------------------|------------------------------------------------------|---------|---------|
| GET    | `/api/dashboard/stats`    | Single object with totals and counts                 | `200`   | `500`   |

**Example response — `GET /api/dashboard/stats`**

```json
{
  "total_users": 10,
  "total_restaurants": 10,
  "total_reservations": 15,
  "total_reviews": 15,
  "average_rating": "4.21",
  "confirmed_reservations": 6,
  "cancelled_reservations": 2
}
```

**Frontend notes**

- Returns a **single object**, not an array.
- `average_rating` is a string and can be `null` if there are no reviews; coerce or guard before formatting.

---

## Error response shape

All errors return JSON. Common codes used by this API:

| Status | When                                                              | Example body                                                                                             |
|--------|-------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `400`  | Client-side validation failure or foreign-key violation           | `{ "error": "party_size must be greater than 0" }`                                                       |
| `404`  | Resource not found (e.g. `PUT`/`DELETE` with missing id) or unknown route | `{ "error": "Reservation not found" }` or `{ "ok": false, "error": "Not found" }`                  |
| `409`  | Unique constraint violation (e.g. duplicate email)                | `{ "error": "Email already exists", "message": "Key (email)=(...) already exists." }`                   |
| `500`  | Unexpected server / DB error                                      | `{ "error": "Failed to load reservations", "message": "..." }`                                          |
| `503`  | Database connectivity check failed (`/api/test-db` only)          | `{ "ok": false, "error": "Could not connect to PostgreSQL", "detail": "..." }`                          |

---

## Quick reference (all endpoints)

| Method | Endpoint                                |
|--------|-----------------------------------------|
| GET    | `/`                                     |
| GET    | `/api/test-db`                          |
| GET    | `/api/restaurants`                      |
| GET    | `/api/restaurants/:id`                  |
| GET    | `/api/restaurants/:id/reviews`          |
| GET    | `/api/users`                            |
| POST   | `/api/users`                            |
| GET    | `/api/reservations`                     |
| POST   | `/api/reservations`                     |
| PUT    | `/api/reservations/:id`                 |
| PATCH  | `/api/reservations/:id/cancel`          |
| DELETE | `/api/reservations/:id`                 |
| GET    | `/api/reviews`                          |
| POST   | `/api/reviews`                          |
| PUT    | `/api/reviews/:id`                      |
| DELETE | `/api/reviews/:id`                      |
| GET    | `/api/platforms`                        |
| GET    | `/api/restaurant-platforms`             |
| GET    | `/api/dashboard/stats`                  |
