--
-- PostgreSQL database dump
--

\restrict JW6qLv4cIub26srYIIYtm9OwwvtpbhCFlYZYgDnr8aeNKtfVD0GIobIwEej2FvA

-- Dumped from database version 15.17 (Homebrew)
-- Dumped by pg_dump version 15.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY "public"."reviews" DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."reviews" DROP CONSTRAINT IF EXISTS "reviews_restaurant_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."restaurant_platforms" DROP CONSTRAINT IF EXISTS "restaurant_platforms_restaurant_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."restaurant_platforms" DROP CONSTRAINT IF EXISTS "restaurant_platforms_platform_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."reservations" DROP CONSTRAINT IF EXISTS "reservations_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."reservations" DROP CONSTRAINT IF EXISTS "reservations_restaurant_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users" DROP CONSTRAINT IF EXISTS "users_email_key";
ALTER TABLE IF EXISTS ONLY "public"."reviews" DROP CONSTRAINT IF EXISTS "reviews_pkey";
ALTER TABLE IF EXISTS ONLY "public"."restaurants" DROP CONSTRAINT IF EXISTS "restaurants_pkey";
ALTER TABLE IF EXISTS ONLY "public"."restaurant_platforms" DROP CONSTRAINT IF EXISTS "restaurant_platforms_pkey";
ALTER TABLE IF EXISTS ONLY "public"."reservations" DROP CONSTRAINT IF EXISTS "reservations_pkey";
ALTER TABLE IF EXISTS ONLY "public"."platforms" DROP CONSTRAINT IF EXISTS "platforms_platform_name_key";
ALTER TABLE IF EXISTS ONLY "public"."platforms" DROP CONSTRAINT IF EXISTS "platforms_pkey";
DROP TABLE IF EXISTS "public"."users";
DROP TABLE IF EXISTS "public"."reviews";
DROP TABLE IF EXISTS "public"."restaurants";
DROP TABLE IF EXISTS "public"."restaurant_platforms";
DROP TABLE IF EXISTS "public"."reservations";
DROP TABLE IF EXISTS "public"."platforms";
--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: platforms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."platforms" (
    "platform_id" integer NOT NULL,
    "platform_name" character varying(100) NOT NULL,
    "api_url" character varying(255)
);


--
-- Name: platforms_platform_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."platforms" ALTER COLUMN "platform_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."platforms_platform_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."reservations" (
    "reservation_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "restaurant_id" integer NOT NULL,
    "reservation_date" "date" NOT NULL,
    "reservation_time" time without time zone NOT NULL,
    "party_size" integer NOT NULL,
    "status" character varying(20) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reservations_party_size_check" CHECK (("party_size" > 0)),
    CONSTRAINT "reservations_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'cancelled'::character varying, 'completed'::character varying])::"text"[])))
);


--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."reservations" ALTER COLUMN "reservation_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."reservations_reservation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: restaurant_platforms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."restaurant_platforms" (
    "restaurant_id" integer NOT NULL,
    "platform_id" integer NOT NULL,
    "external_restaurant_id" character varying(100) NOT NULL
);


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."restaurants" (
    "restaurant_id" integer NOT NULL,
    "name" character varying(150) NOT NULL,
    "address" character varying(200) NOT NULL,
    "city" character varying(100) NOT NULL,
    "cuisine_type" character varying(100),
    "price_range" character varying(20),
    "phone" character varying(20),
    "hours" character varying(100)
);


--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."restaurants" ALTER COLUMN "restaurant_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."restaurants_restaurant_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."reviews" (
    "review_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "restaurant_id" integer NOT NULL,
    "rating" numeric(2,1) NOT NULL,
    "comment" "text",
    "review_date" "date" NOT NULL,
    "source_platform" character varying(50),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= (1)::numeric) AND ("rating" <= (5)::numeric)))
);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."reviews" ALTER COLUMN "review_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."reviews_review_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "user_id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "email" character varying(150) NOT NULL,
    "phone" character varying(20),
    "password_hash" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users" ALTER COLUMN "user_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."users_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: platforms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."platforms" ("platform_id", "platform_name", "api_url") FROM stdin;
1	Yelp	https://api.yelp.com
2	Google	https://maps.googleapis.com
3	TripAdvisor	https://api.tripadvisor.com
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."reservations" ("reservation_id", "user_id", "restaurant_id", "reservation_date", "reservation_time", "party_size", "status", "created_at") FROM stdin;
1	1	1	2026-04-01	19:00:00	4	confirmed	2026-04-27 15:38:27.074063
2	2	2	2026-04-02	18:30:00	2	pending	2026-04-27 15:38:27.074063
3	3	3	2026-04-03	12:15:00	3	completed	2026-04-27 15:38:27.074063
4	4	4	2026-04-04	17:45:00	6	confirmed	2026-04-27 15:38:27.074063
5	5	5	2026-04-05	08:30:00	2	cancelled	2026-04-27 15:38:27.074063
6	6	6	2026-04-06	20:00:00	2	confirmed	2026-04-27 15:38:27.074063
7	7	7	2026-04-07	19:15:00	4	pending	2026-04-27 15:38:27.074063
8	8	8	2026-04-08	13:00:00	5	completed	2026-04-27 15:38:27.074063
9	9	9	2026-04-09	18:00:00	3	confirmed	2026-04-27 15:38:27.074063
10	10	10	2026-04-10	19:30:00	2	completed	2026-04-27 15:38:27.074063
11	1	6	2026-04-11	18:45:00	4	pending	2026-04-27 15:38:27.074063
12	2	9	2026-04-12	12:00:00	1	confirmed	2026-04-27 15:38:27.074063
13	3	5	2026-04-13	09:00:00	2	cancelled	2026-04-27 15:38:27.074063
14	4	10	2026-04-14	20:30:00	8	confirmed	2026-04-27 15:38:27.074063
15	5	1	2026-04-15	11:30:00	1	completed	2026-04-27 15:38:27.074063
\.


--
-- Data for Name: restaurant_platforms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."restaurant_platforms" ("restaurant_id", "platform_id", "external_restaurant_id") FROM stdin;
1	1	yelp_pitch_forks_001
1	2	google_place_pitch_forks
2	1	yelp_sushi_palace_002
2	3	trip_sushi_palace_002
3	2	google_chipotle_tempe
4	1	yelp_barrett_dining
5	2	google_cafe_allegro
5	3	trip_cafe_allegro
6	1	yelp_desert_bistro
6	2	google_desert_bistro
7	3	trip_pho_valley
8	1	yelp_taco_libre
9	2	google_green_leaf
10	1	yelp_riverside_grill
10	3	trip_riverside_grill
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."restaurants" ("restaurant_id", "name", "address", "city", "cuisine_type", "price_range", "phone", "hours") FROM stdin;
1	Pitch Forks	123 Main St	Tempe	Variety of cuisines	$$	4801111111	10:00 AM - 9:00 PM
2	Sushi Palace	456 Elm St	Phoenix	Japanese	$$$	4802222222	11:00 AM - 10:00 PM
3	Chipotle	789 Oak St	Tempe	Mexican	$	4803333333	9:00 AM - 11:00 PM
4	Barrett Dining Hall	821 East Lemon Hall	Tempe	Variety of cuisines	$$	4804444444	9:00 AM - 9:00 PM
5	Cafe Allegro	100 University Dr	Tempe	Italian	$$	4805555555	8:00 AM - 8:00 PM
6	Desert Bistro	2100 N Scottsdale Rd	Scottsdale	American	$$$$	4806666666	5:00 PM - 10:00 PM
7	Pho Valley	330 W Baseline Rd	Mesa	Vietnamese	$$	4807777777	10:30 AM - 9:30 PM
8	Taco Libre	55 W Broadway	Tempe	Mexican	$	4808888888	11:00 AM - 12:00 AM
9	Green Leaf Kitchen	400 E Rio Salado Pkwy	Tempe	Vegan	$$	4809999999	11:00 AM - 9:00 PM
10	Riverside Grill	1 N Mill Ave	Tempe	Steakhouse	$$$	4801212121	4:00 PM - 11:00 PM
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."reviews" ("review_id", "user_id", "restaurant_id", "rating", "comment", "review_date", "source_platform") FROM stdin;
1	1	1	4.5	Dining hall food was great!	2026-03-01	Yelp
2	2	2	5.0	Amazing sushi and fresh fish.	2026-03-02	Google
3	3	3	3.5	Fast and consistent; lines at lunch.	2026-03-03	TripAdvisor
4	4	4	4.0	Lots of options for dietary needs.	2026-03-04	Google
5	5	5	4.2	Great espresso and panini.	2026-03-05	Yelp
6	6	6	4.8	Pricey but worth it for a date night.	2026-03-06	TripAdvisor
7	7	7	4.6	Broth was rich and aromatic.	2026-03-07	Yelp
8	8	8	3.8	Solid tacos; outdoor seating is nice.	2026-03-08	Google
9	9	9	4.1	Creative vegan dishes.	2026-03-09	TripAdvisor
10	10	10	4.7	Steak cooked perfectly.	2026-03-10	Yelp
11	1	5	2.5	A bit slow during the morning rush.	2026-03-11	Google
12	2	7	5.0	Best pho in the East Valley.	2026-03-12	Yelp
13	3	9	4.3	Fresh ingredients every time.	2026-03-13	Google
14	4	2	3.2	Good but noisy on weekends.	2026-03-14	TripAdvisor
15	5	6	4.9	Sommelier recommendations were spot on.	2026-03-15	Yelp
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("user_id", "name", "email", "phone", "password_hash", "created_at") FROM stdin;
1	Colton Jim	asurite1@asu.edu	4801234567	hash_placeholder_1	2026-04-27 15:38:27.062705
2	Khoa Vo	asurite2@asu.edu	4802345678	hash_placeholder_2	2026-04-27 15:38:27.062705
3	Kowan Atcitty	asurite3@asu.edu	4803456789	hash_placeholder_3	2026-04-27 15:38:27.062705
4	Alex Rivera	arivera@asu.edu	4804567890	hash_placeholder_4	2026-04-27 15:38:27.062705
5	Jordan Lee	jlee@asu.edu	4805678901	hash_placeholder_5	2026-04-27 15:38:27.062705
6	Sam Patel	spatel@asu.edu	4806789012	hash_placeholder_6	2026-04-27 15:38:27.062705
7	Taylor Chen	tchen@asu.edu	4807890123	hash_placeholder_7	2026-04-27 15:38:27.062705
8	Morgan Brooks	mbrooks@asu.edu	4808901234	hash_placeholder_8	2026-04-27 15:38:27.062705
9	Riley Nguyen	rnguyen@asu.edu	4809012345	hash_placeholder_9	2026-04-27 15:38:27.062705
10	Casey Williams	cwilliams@asu.edu	4800123456	hash_placeholder_10	2026-04-27 15:38:27.062705
\.


--
-- Name: platforms_platform_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."platforms_platform_id_seq"', 3, true);


--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."reservations_reservation_id_seq"', 18, true);


--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."restaurants_restaurant_id_seq"', 10, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."reviews_review_id_seq"', 19, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_user_id_seq"', 14, true);


--
-- Name: platforms platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."platforms"
    ADD CONSTRAINT "platforms_pkey" PRIMARY KEY ("platform_id");


--
-- Name: platforms platforms_platform_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."platforms"
    ADD CONSTRAINT "platforms_platform_name_key" UNIQUE ("platform_name");


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservation_id");


--
-- Name: restaurant_platforms restaurant_platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."restaurant_platforms"
    ADD CONSTRAINT "restaurant_platforms_pkey" PRIMARY KEY ("restaurant_id", "platform_id");


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."restaurants"
    ADD CONSTRAINT "restaurants_pkey" PRIMARY KEY ("restaurant_id");


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id");


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");


--
-- Name: reservations reservations_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE;


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- Name: restaurant_platforms restaurant_platforms_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."restaurant_platforms"
    ADD CONSTRAINT "restaurant_platforms_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("platform_id") ON DELETE CASCADE;


--
-- Name: restaurant_platforms restaurant_platforms_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."restaurant_platforms"
    ADD CONSTRAINT "restaurant_platforms_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE;


--
-- Name: reviews reviews_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("restaurant_id") ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict JW6qLv4cIub26srYIIYtm9OwwvtpbhCFlYZYgDnr8aeNKtfVD0GIobIwEej2FvA

