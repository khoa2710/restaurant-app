-- Seed data for Restaurant Booking and Review Platform (run after schema.sql)

INSERT INTO users (name, email, phone, password_hash) VALUES
  ('Colton Jim', 'asurite1@asu.edu', '4801234567', 'hash_placeholder_1'),
  ('Khoa Vo', 'asurite2@asu.edu', '4802345678', 'hash_placeholder_2'),
  ('Kowan Atcitty', 'asurite3@asu.edu', '4803456789', 'hash_placeholder_3'),
  ('Alex Rivera', 'arivera@asu.edu', '4804567890', 'hash_placeholder_4'),
  ('Jordan Lee', 'jlee@asu.edu', '4805678901', 'hash_placeholder_5'),
  ('Sam Patel', 'spatel@asu.edu', '4806789012', 'hash_placeholder_6'),
  ('Taylor Chen', 'tchen@asu.edu', '4807890123', 'hash_placeholder_7'),
  ('Morgan Brooks', 'mbrooks@asu.edu', '4808901234', 'hash_placeholder_8'),
  ('Riley Nguyen', 'rnguyen@asu.edu', '4809012345', 'hash_placeholder_9'),
  ('Casey Williams', 'cwilliams@asu.edu', '4800123456', 'hash_placeholder_10');

INSERT INTO restaurants (name, address, city, cuisine_type, price_range, phone, hours) VALUES
  ('Pitch Forks', '123 Main St', 'Tempe', 'Variety of cuisines', '$$', '4801111111', '10:00 AM - 9:00 PM'),
  ('Sushi Palace', '456 Elm St', 'Phoenix', 'Japanese', '$$$', '4802222222', '11:00 AM - 10:00 PM'),
  ('Chipotle', '789 Oak St', 'Tempe', 'Mexican', '$', '4803333333', '9:00 AM - 11:00 PM'),
  ('Barrett Dining Hall', '821 East Lemon Hall', 'Tempe', 'Variety of cuisines', '$$', '4804444444', '9:00 AM - 9:00 PM'),
  ('Cafe Allegro', '100 University Dr', 'Tempe', 'Italian', '$$', '4805555555', '8:00 AM - 8:00 PM'),
  ('Desert Bistro', '2100 N Scottsdale Rd', 'Scottsdale', 'American', '$$$$', '4806666666', '5:00 PM - 10:00 PM'),
  ('Pho Valley', '330 W Baseline Rd', 'Mesa', 'Vietnamese', '$$', '4807777777', '10:30 AM - 9:30 PM'),
  ('Taco Libre', '55 W Broadway', 'Tempe', 'Mexican', '$', '4808888888', '11:00 AM - 12:00 AM'),
  ('Green Leaf Kitchen', '400 E Rio Salado Pkwy', 'Tempe', 'Vegan', '$$', '4809999999', '11:00 AM - 9:00 PM'),
  ('Riverside Grill', '1 N Mill Ave', 'Tempe', 'Steakhouse', '$$$', '4801212121', '4:00 PM - 11:00 PM');

INSERT INTO platforms (platform_name, api_url) VALUES
  ('Yelp', 'https://api.yelp.com'),
  ('Google', 'https://maps.googleapis.com'),
  ('TripAdvisor', 'https://api.tripadvisor.com');

INSERT INTO reviews (user_id, restaurant_id, rating, comment, review_date, source_platform) VALUES
  (1, 1, 4.5, 'Dining hall food was great!', '2026-03-01', 'Yelp'),
  (2, 2, 5.0, 'Amazing sushi and fresh fish.', '2026-03-02', 'Google'),
  (3, 3, 3.5, 'Fast and consistent; lines at lunch.', '2026-03-03', 'TripAdvisor'),
  (4, 4, 4.0, 'Lots of options for dietary needs.', '2026-03-04', 'Google'),
  (5, 5, 4.2, 'Great espresso and panini.', '2026-03-05', 'Yelp'),
  (6, 6, 4.8, 'Pricey but worth it for a date night.', '2026-03-06', 'TripAdvisor'),
  (7, 7, 4.6, 'Broth was rich and aromatic.', '2026-03-07', 'Yelp'),
  (8, 8, 3.8, 'Solid tacos; outdoor seating is nice.', '2026-03-08', 'Google'),
  (9, 9, 4.1, 'Creative vegan dishes.', '2026-03-09', 'TripAdvisor'),
  (10, 10, 4.7, 'Steak cooked perfectly.', '2026-03-10', 'Yelp'),
  (1, 5, 2.5, 'A bit slow during the morning rush.', '2026-03-11', 'Google'),
  (2, 7, 5.0, 'Best pho in the East Valley.', '2026-03-12', 'Yelp'),
  (3, 9, 4.3, 'Fresh ingredients every time.', '2026-03-13', 'Google'),
  (4, 2, 3.2, 'Good but noisy on weekends.', '2026-03-14', 'TripAdvisor'),
  (5, 6, 4.9, 'Sommelier recommendations were spot on.', '2026-03-15', 'Yelp');

INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, party_size, status) VALUES
  (1, 1, '2026-04-01', '19:00', 4, 'confirmed'),
  (2, 2, '2026-04-02', '18:30', 2, 'pending'),
  (3, 3, '2026-04-03', '12:15', 3, 'completed'),
  (4, 4, '2026-04-04', '17:45', 6, 'confirmed'),
  (5, 5, '2026-04-05', '08:30', 2, 'cancelled'),
  (6, 6, '2026-04-06', '20:00', 2, 'confirmed'),
  (7, 7, '2026-04-07', '19:15', 4, 'pending'),
  (8, 8, '2026-04-08', '13:00', 5, 'completed'),
  (9, 9, '2026-04-09', '18:00', 3, 'confirmed'),
  (10, 10, '2026-04-10', '19:30', 2, 'completed'),
  (1, 6, '2026-04-11', '18:45', 4, 'pending'),
  (2, 9, '2026-04-12', '12:00', 1, 'confirmed'),
  (3, 5, '2026-04-13', '09:00', 2, 'cancelled'),
  (4, 10, '2026-04-14', '20:30', 8, 'confirmed'),
  (5, 1, '2026-04-15', '11:30', 1, 'completed');

INSERT INTO restaurant_platforms (restaurant_id, platform_id, external_restaurant_id) VALUES
  (1, 1, 'yelp_pitch_forks_001'),
  (1, 2, 'google_place_pitch_forks'),
  (2, 1, 'yelp_sushi_palace_002'),
  (2, 3, 'trip_sushi_palace_002'),
  (3, 2, 'google_chipotle_tempe'),
  (4, 1, 'yelp_barrett_dining'),
  (5, 2, 'google_cafe_allegro'),
  (5, 3, 'trip_cafe_allegro'),
  (6, 1, 'yelp_desert_bistro'),
  (6, 2, 'google_desert_bistro'),
  (7, 3, 'trip_pho_valley'),
  (8, 1, 'yelp_taco_libre'),
  (9, 2, 'google_green_leaf'),
  (10, 1, 'yelp_riverside_grill'),
  (10, 3, 'trip_riverside_grill');
