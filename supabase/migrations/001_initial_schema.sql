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

CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'sold_out', 'archived');
CREATE TYPE video_status AS ENUM ('processing', 'ready', 'error');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — extends auth.users with app-specific data
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  role            user_role DEFAULT 'buyer',
  is_verified     BOOLEAN DEFAULT false,
  stripe_account_id TEXT,
  follower_count  INT DEFAULT 0,
  following_count INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- categories — product taxonomy
-- ----------------------------------------------------------------------------
CREATE TABLE public.categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon_url    TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- products — items listed for sale
-- ----------------------------------------------------------------------------
CREATE TABLE public.products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id       INT REFERENCES public.categories(id),
  title             TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10,2) CHECK (compare_at_price >= 0),
  stock             INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status            product_status DEFAULT 'draft',
  attributes        JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- product_images — gallery images per product
-- ----------------------------------------------------------------------------
CREATE TABLE public.product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- videos — short-form video content (Mux-powered)
-- ----------------------------------------------------------------------------
CREATE TABLE public.videos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id    UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

-- ----------------------------------------------------------------------------
-- comments — user comments on videos
-- ----------------------------------------------------------------------------
CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id    UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- follows — social graph (follower → following)
-- ----------------------------------------------------------------------------
CREATE TABLE public.follows (
  follower_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ----------------------------------------------------------------------------
-- orders — purchase records
-- ----------------------------------------------------------------------------
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  total             NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status            order_status DEFAULT 'pending',
  shipping_address  JSONB,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- order_items — line items within an order
-- ----------------------------------------------------------------------------
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id),
  seller_id   UUID NOT NULL REFERENCES public.profiles(id),
  quantity    INT NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

-- videos
CREATE INDEX idx_videos_user_id    ON public.videos (user_id);
CREATE INDEX idx_videos_product_id ON public.videos (product_id);
CREATE INDEX idx_videos_status     ON public.videos (status);
CREATE INDEX idx_videos_created_at ON public.videos (created_at DESC);

-- products
CREATE INDEX idx_products_seller_id   ON public.products (seller_id);
CREATE INDEX idx_products_category_id ON public.products (category_id);
CREATE INDEX idx_products_status      ON public.products (status);

-- comments
CREATE INDEX idx_comments_video_id   ON public.comments (video_id);
CREATE INDEX idx_comments_created_at ON public.comments (created_at DESC);

-- likes
CREATE INDEX idx_likes_video_id ON public.likes (video_id);

-- follows
CREATE INDEX idx_follows_following_id ON public.follows (following_id);

-- orders
CREATE INDEX idx_orders_buyer_id ON public.orders (buyer_id);
CREATE INDEX idx_orders_status   ON public.orders (status);

-- order_items
CREATE INDEX idx_order_items_order_id  ON public.order_items (order_id);
CREATE INDEX idx_order_items_seller_id ON public.order_items (seller_id);

-- ============================================================================
-- 5. FUNCTION: handle_new_user()
-- Automatically creates a profile row when a new user signs up.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. COUNTER TRIGGER FUNCTIONS
-- Keep denormalized counts in sync automatically.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 6a. Like count on videos
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_video_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos
      SET like_count = like_count + 1
      WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos
      SET like_count = GREATEST(like_count - 1, 0)
      WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_video_like_count();

-- ----------------------------------------------------------------------------
-- 6b. Comment count on videos
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_video_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos
      SET comment_count = comment_count + 1
      WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos
      SET comment_count = GREATEST(comment_count - 1, 0)
      WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_video_comment_count();

-- ----------------------------------------------------------------------------
-- 6c. Follower / following counts on profiles
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET follower_count  = follower_count  + 1 WHERE id = NEW.following_id;
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET follower_count  = GREATEST(follower_count  - 1, 0) WHERE id = OLD.following_id;
    UPDATE public.profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

-- ============================================================================
-- 7. UPDATED_AT TRIGGER
-- Generic function applied to any table with an updated_at column.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items    ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
CREATE POLICY "products_select_public_or_own"
  ON public.products FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "products_insert_seller"
  ON public.products FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'seller'
    )
    AND seller_id = auth.uid()
  );

CREATE POLICY "products_update_own"
  ON public.products FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "products_delete_own"
  ON public.products FOR DELETE
  USING (seller_id = auth.uid());

-- ----------------------------------------------------------------------------
-- product_images
-- ----------------------------------------------------------------------------
CREATE POLICY "product_images_select_public"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "product_images_insert_owner"
  ON public.product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "product_images_update_owner"
  ON public.product_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "product_images_delete_owner"
  ON public.product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- videos
-- ----------------------------------------------------------------------------
CREATE POLICY "videos_select_ready_or_own"
  ON public.videos FOR SELECT
  USING (status = 'ready' OR user_id = auth.uid());

CREATE POLICY "videos_insert_auth"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "videos_update_own"
  ON public.videos FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "videos_delete_own"
  ON public.videos FOR DELETE
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- likes
-- ----------------------------------------------------------------------------
CREATE POLICY "likes_select_public"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "likes_insert_own"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "likes_delete_own"
  ON public.likes FOR DELETE
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- comments
-- ----------------------------------------------------------------------------
CREATE POLICY "comments_select_public"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "comments_insert_own"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "comments_delete_own"
  ON public.comments FOR DELETE
  USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- follows
-- ----------------------------------------------------------------------------
CREATE POLICY "follows_select_public"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "follows_insert_own"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND follower_id = auth.uid());

CREATE POLICY "follows_delete_own"
  ON public.follows FOR DELETE
  USING (follower_id = auth.uid());

-- ----------------------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------------------
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (buyer_id = auth.uid());

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND buyer_id = auth.uid());

-- ----------------------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------------------
CREATE POLICY "order_items_select_buyer_or_seller"
  ON public.order_items FOR SELECT
  USING (
    seller_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND buyer_id = auth.uid()
    )
  );

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
