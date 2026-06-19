-- ============================================================================
-- Sellbox — Seed Data
-- Populates initial categories for the platform.
-- ============================================================================

INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Electrónica',  'electronica',  1),
  ('Moda',         'moda',         2),
  ('Hogar',        'hogar',        3),
  ('Deportes',     'deportes',     4),
  ('Belleza',      'belleza',      5),
  ('Libros',       'libros',       6),
  ('Juguetes',     'juguetes',     7),
  ('Alimentos',    'alimentos',    8),
  ('Mascotas',     'mascotas',     9),
  ('Otros',        'otros',       10);
