-- Restaurant Booking and Review Platform — PostgreSQL schema (CSE 412 Phase 2 design)

DROP TABLE IF EXISTS restaurant_platforms CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS platforms CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  restaurant_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  cuisine_type VARCHAR(100),
  price_range VARCHAR(20),
  phone VARCHAR(20),
  hours VARCHAR(100)
);

CREATE TABLE platforms (
  platform_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  platform_name VARCHAR(100) NOT NULL UNIQUE,
  api_url VARCHAR(255)
);

CREATE TABLE reviews (
  review_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL
    CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_date DATE NOT NULL,
  source_platform VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (restaurant_id) ON DELETE CASCADE
);

CREATE TABLE reservations (
  reservation_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  status VARCHAR(20) NOT NULL
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (restaurant_id) ON DELETE CASCADE
);

CREATE TABLE restaurant_platforms (
  restaurant_id INT NOT NULL,
  platform_id INT NOT NULL,
  external_restaurant_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (restaurant_id, platform_id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (restaurant_id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms (platform_id) ON DELETE CASCADE
);
