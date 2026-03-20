ALTER TABLE public.store_settings
  ADD COLUMN hero_subtitle text NOT NULL DEFAULT 'Nova Coleção',
  ADD COLUMN hero_title text NOT NULL DEFAULT 'Estilo que você carrega',
  ADD COLUMN hero_description text NOT NULL DEFAULT 'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.',
  ADD COLUMN hero_cta_text text NOT NULL DEFAULT 'Ver Coleção';