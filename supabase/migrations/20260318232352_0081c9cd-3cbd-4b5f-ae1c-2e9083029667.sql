
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_link text NOT NULL DEFAULT '#produtos',
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT TO public USING (true);
CREATE POLICY "Auth insert hero_slides" ON public.hero_slides FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update hero_slides" ON public.hero_slides FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete hero_slides" ON public.hero_slides FOR DELETE TO authenticated USING (true);

-- Seed 3 initial slides
INSERT INTO public.hero_slides (sort_order, subtitle, title, description, cta_text, cta_link) VALUES
  (0, 'Nova Coleção', 'Estilo que você carrega', 'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.', 'Ver Coleção', '#produtos'),
  (1, 'Joias', 'Brilho e Elegância', 'Joias que complementam seu estilo com sofisticação e delicadeza.', 'Ver Joias', '/categorias'),
  (2, 'Óculos', 'Visão com Estilo', 'Óculos que combinam proteção e design para todos os momentos.', 'Ver Óculos', '/categorias');
