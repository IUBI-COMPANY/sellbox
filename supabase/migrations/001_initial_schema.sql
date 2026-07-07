-- ============================================================================
-- Sellbox — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Complete schema for the TikTok-style e-commerce platform.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. CUSTOM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE video_status AS ENUM ('pending','processing','ready','error');

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users — extends auth.users with app-specific data
-- ----------------------------------------------------------------------------
CREATE TABLE public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  role            user_role DEFAULT 'user',
  is_verified     BOOLEAN DEFAULT false,
  follower_count  INT DEFAULT 0,
  following_count INT DEFAULT 0,
  like_count      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- videos — short-form video content (Mux-powered)
-- ----------------------------------------------------------------------------
CREATE TABLE public.videos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES public.products(id) ON DELETE SET NULL,
  mux_asset_id      TEXT,
  mux_playback_id   TEXT,
  title             TEXT,
  description       TEXT,
  duration_seconds  INT,
  status            video_status DEFAULT 'processing',
  view_count        INT DEFAULT 0,
  like_count        INT DEFAULT 0,
  comment_count     INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- likes — user ↔ video likes (composite PK prevents duplicates)
-- ----------------------------------------------------------------------------
CREATE TABLE public.likes (
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  video_id    UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

-- ----------------------------------------------------------------------------
-- comments — user comments on videos
-- ----------------------------------------------------------------------------
CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  video_id    UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- follows — social graph (follower → following)
-- ----------------------------------------------------------------------------
CREATE TABLE public.follows (
  follower_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);
