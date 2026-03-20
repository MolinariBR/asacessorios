-- Seed default store data without overwriting existing records.

INSERT INTO public.store_settings (
  whatsapp_number,
  store_name,
  store_address,
  store_cep,
  default_freight,
  hero_image,
  hero_subtitle,
  hero_title,
  hero_description,
  hero_cta_text
)
SELECT
  '5511999999999',
  'AS Acessórios',
  'Rua Exemplo, 123 - Centro',
  '01000-000',
  25.00,
  '',
  'Nova Coleção',
  'Estilo que você carrega',
  'Bolsas e acessórios com design contemporâneo para o seu dia a dia.',
  'Ver Coleção'
WHERE NOT EXISTS (
  SELECT 1 FROM public.store_settings
);

INSERT INTO public.freight_zones (name, distance_min, distance_max, price)
SELECT seed.name, seed.distance_min, seed.distance_max, seed.price
FROM (
  VALUES
    ('Zona 1', 0.00, 5.00, 12.00),
    ('Zona 2', 5.01, 12.00, 18.00),
    ('Zona 3', 12.01, 20.00, 25.00)
) AS seed(name, distance_min, distance_max, price)
WHERE NOT EXISTS (
  SELECT 1 FROM public.freight_zones
);

INSERT INTO public.coupons (code, discount_percent, active)
SELECT seed.code, seed.discount_percent, seed.active
FROM (
  VALUES
    ('BEMVINDO10', 10.00, true)
) AS seed(code, discount_percent, active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.coupons
);

INSERT INTO public.products (name, description, price, image, category, color)
SELECT
  seed.name,
  seed.description,
  seed.price,
  seed.image,
  seed.category,
  seed.color
FROM (
  VALUES
    (
      'Bolsa Tote Elegance',
      'Bolsa espaçosa com acabamento premium para rotina e trabalho.',
      249.90,
      '/assets/product-tote.jpg',
      'Bolsas',
      'Caramelo'
    ),
    (
      'Bolsa Crossbody Urban',
      'Modelo transversal compacto para compor looks casuais com praticidade.',
      189.90,
      '/assets/product-crossbody.jpg',
      'Bolsas',
      'Preto'
    ),
    (
      'Clutch Noite',
      'Peça sofisticada para eventos, com design minimalista e elegante.',
      159.90,
      '/assets/product-clutch.jpg',
      'Clutches',
      'Preto'
    ),
    (
      'Bucket Essencial',
      'Bolsa bucket versátil para o dia a dia, com visual moderno e leve.',
      219.90,
      '/assets/product-bucket.jpg',
      'Bolsas',
      'Bege'
    ),
    (
      'Mochila City',
      'Mochila estruturada com espaço interno ideal para rotina urbana.',
      279.90,
      '/assets/product-backpack.jpg',
      'Mochilas',
      'Marrom'
    )
) AS seed(name, description, price, image, category, color)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products
);
