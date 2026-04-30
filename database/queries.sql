
-- queries.sql — Restaurant Booking and Review Platform (PostgreSQL)
-- Reference and manual testing. Backend may adapt these with parameters ($1).

-- 1. View all users
SELECT user_id, name, email, phone, created_at
FROM users
ORDER BY user_id;

-- 2. View all restaurants
SELECT restaurant_id, name, address, city, cuisine_type, price_range, phone, hours
FROM restaurants
ORDER BY name;

-- 3. View all platforms
SELECT platform_id, platform_name, api_url
FROM platforms
ORDER BY platform_name;

-- 4. View all reviews
SELECT review_id, user_id, restaurant_id, rating, comment, review_date, source_platform
FROM reviews
ORDER BY review_date DESC, review_id;

-- 5. View all reservations
SELECT reservation_id, user_id, restaurant_id, reservation_date, reservation_time,
       party_size, status, created_at
FROM reservations
ORDER BY reservation_date DESC, reservation_time DESC;

-- 6. Browse restaurants with average rating - Includes restaurants with no reviews (average_rating NULL, review_count 0).
SELECT
  r.restaurant_id,
  r.name,
  r.city,
  r.cuisine_type,
  r.price_range,
  ROUND(AVG(rv.rating)::numeric, 2) AS average_rating,
  COUNT(rv.review_id) AS review_count
FROM restaurants r
LEFT JOIN reviews rv ON r.restaurant_id = rv.restaurant_id
GROUP BY r.restaurant_id
ORDER BY average_rating DESC NULLS LAST, r.name;

-- 7. Search restaurants by city - Example: restaurants in Tempe.
SELECT restaurant_id, name, address, city, cuisine_type, price_range, phone, hours
FROM restaurants
WHERE city = 'Tempe'
ORDER BY name;

-- 8. Search restaurants by cuisine type - Example: Japanese restaurants.
SELECT restaurant_id, name, address, city, cuisine_type, price_range, phone, hours
FROM restaurants
WHERE cuisine_type ILIKE '%Japanese%'
ORDER BY name;

-- 9. View restaurant details with reviews - Example: single restaurant (restaurant_id = 2) with each review and reviewer.
SELECT
  r.restaurant_id,
  r.name AS restaurant_name,
  r.address,
  r.city,
  r.cuisine_type,
  r.price_range,
  r.phone,
  r.hours,
  rev.review_id,
  u.name AS reviewer_name,
  rev.rating,
  rev.comment,
  rev.review_date,
  rev.source_platform
FROM restaurants r
LEFT JOIN reviews rev ON r.restaurant_id = rev.restaurant_id
LEFT JOIN users u ON rev.user_id = u.user_id
WHERE r.restaurant_id = 2
ORDER BY rev.review_date DESC NULLS LAST, rev.review_id;

-- 10. View all reservations with user names and restaurant names
SELECT
  res.reservation_id,
  res.reservation_date,
  res.reservation_time,
  res.party_size,
  res.status,
  res.created_at,
  u.name AS user_name,
  u.email AS user_email,
  rest.name AS restaurant_name,
  rest.city AS restaurant_city
FROM reservations res
JOIN users u ON res.user_id = u.user_id
JOIN restaurants rest ON res.restaurant_id = rest.restaurant_id
ORDER BY res.reservation_date DESC, res.reservation_time DESC;

-- 11. View all reviews with user names and restaurant names
SELECT
  rev.review_id,
  rev.rating,
  rev.comment,
  rev.review_date,
  rev.source_platform,
  u.name AS user_name,
  rest.name AS restaurant_name,
  rest.city AS restaurant_city
FROM reviews rev
JOIN users u ON rev.user_id = u.user_id
JOIN restaurants rest ON rev.restaurant_id = rest.restaurant_id
ORDER BY rev.review_date DESC, rev.review_id;

-- 12. View platform mappings for each restaurant
SELECT
  r.restaurant_id,
  r.name AS restaurant_name,
  r.city,
  p.platform_name,
  rp.external_restaurant_id
FROM restaurants r
LEFT JOIN restaurant_platforms rp ON r.restaurant_id = rp.restaurant_id
LEFT JOIN platforms p ON rp.platform_id = p.platform_id
ORDER BY r.name, p.platform_name NULLS LAST;

-- 13. Dashboard statistics
SELECT
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM restaurants) AS total_restaurants,
  (SELECT COUNT(*) FROM reservations) AS total_reservations,
  (SELECT COUNT(*) FROM reviews) AS total_reviews,
  (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews) AS average_rating_all_reviews,
  (SELECT COUNT(*) FROM reservations WHERE status = 'confirmed') AS confirmed_reservations,
  (SELECT COUNT(*) FROM reservations WHERE status = 'cancelled') AS cancelled_reservations;

-- 14. Example INSERT — create a new reservation
-- reservation_id is auto-generated; omit it. Example: user 1 books restaurant 2.
INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, party_size, status)
VALUES (1, 2, '2026-05-15', '19:00', 3, 'pending');


-- 15. Example INSERT — create a new review
-- review_id is auto-generated; omit it. Example: user 1 reviews restaurant 2.
INSERT INTO reviews (user_id, restaurant_id, rating, comment, review_date, source_platform)
VALUES (1, 2, 4.5, 'Excellent food and friendly staff.', '2026-04-22', 'Yelp');

-- 16. Example UPDATE — update reservation status
-- Example: confirm reservation_id = 1 (adjust ID to match your database).
UPDATE reservations
SET status = 'confirmed'
WHERE reservation_id = 1;

-- 17. Example UPDATE — update a review
-- Example: edit review_id = 1 (adjust ID to match your database).
UPDATE reviews
SET
  rating = 5.0,
  comment = 'Updated after a second visit — even better!',
  review_date = '2026-04-23'
WHERE review_id = 1;

-- 18. Example DELETE — delete a reservation
-- Example: cancel/remove reservation_id = 1 (adjust ID to match your database).
DELETE FROM reservations
WHERE reservation_id = 1;

-- 19. Example DELETE — delete a review
-- Example: remove review_id = 1 (adjust ID to match your database).
DELETE FROM reviews
WHERE review_id = 1;
