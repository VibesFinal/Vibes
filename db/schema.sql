--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: mehyar
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    post_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO mehyar;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: mehyar
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO mehyar;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehyar
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: mehyar
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    user_id integer,
    post_id integer
);


ALTER TABLE public.likes OWNER TO mehyar;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: mehyar
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO mehyar;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehyar
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: mehyar
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.posts OWNER TO mehyar;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: mehyar
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO mehyar;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehyar
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mehyar
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO mehyar;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mehyar
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO mehyar;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mehyar
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: likes likes_user_id_post_id_key; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_post_id_key UNIQUE (user_id, post_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mehyar
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Migration: Add category column to posts table
-- Run: psql -d vibesdb -f migrations/2025_09_08_add_category_to_posts.sql

ALTER TABLE posts
ADD COLUMN category VARCHAR(50);


-- Migration: Add is_anonymous column to posts table
-- Run: psql -d vibesdb -f migrations/2025_09_08_add_is_anonymous_to_posts.sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;


-- Migration: Create follows table
-- Run: psql -d vibesdb -f migrations/2025_09_13_create_follows_table.sql

CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);



ALTER TABLE posts ADD COLUMN photo TEXT;
ALTER TABLE posts ADD COLUMN video TEXT;


-- likes table update / important note : drop the reaction_type column before you run these commands

ALTER TABLE likes
DROP COLUMN reaction_type;

ALTER TABLE likes
ADD COLUMN reaction_type VARCHAR(20) DEFAULT 'like';


ALTER TABLE likes
ADD CONSTRAINT unique_reaction_per_post UNIQUE(user_id, post_id);


UPDATE likes
SET reaction_type = 'like'
WHERE reaction_type IS NULL;

---- add table communites ----
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  icon VARCHAR(10) NOT NULL,
  tags JSONB NOT NULL, -- store array like ["anxiety", "support"]
  is_joined BOOLEAN DEFAULT FALSE -- for demo; in real app, this should be user-specific
);

-------- insert Data inside the table -------
INSERT INTO communities (name, description, member_count, icon, tags, is_joined)
VALUES
  ('Anxiety Support Circle', 'A safe space to share experiences, coping strategies, and encouragement for those managing anxiety.', 1247, '🧠', '["anxiety", "support", "cbt"]', true),
  ('Depression Warriors', 'You are not alone. Share your story, find hope, and connect with others walking the same path.', 893, '💙', '["depression", "hope", "peer-support"]', false),
  ('Mindful Living Group', 'Daily mindfulness, meditation tips, and gentle reminders to breathe and be present.', 2105, '🧘', '["mindfulness", "meditation", "calm"]', true),
  ('PTSD Healing Space', 'Trauma-informed support group for survivors. Trigger warnings enabled. Moderated 24/7.', 568, '🛡️', '["ptsd", "trauma", "safe-space"]', false);


-- Migration: Create badge_types table
-- Run: psql -d vibesdb -f migrations/2025_09_20_create_badge_types_table.sql

CREATE TABLE IF NOT EXISTS badge_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial badge 2 types 
INSERT INTO badge_types (name, description, image_url) VALUES
('Supportive Soul', 'Leave 20 comments on other people''s posts', '/uploads/badges/supportive_soul.jpeg'),
('Story Teller', 'Write 10 posts', '/uploads/badges/story_teller.jpeg');

-- Migration: Create user_badges table
-- Run: psql -d vibesdb -f migrations/2025_09_20_create_user_badges_table.sql

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT NOT NULL REFERENCES badge_types(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);
