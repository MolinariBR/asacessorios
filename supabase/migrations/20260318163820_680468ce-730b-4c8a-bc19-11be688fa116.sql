
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Store settings (singleton)
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL DEFAULT '5511999999999',
  store_name TEXT NOT NULL DEFAULT 'AS Acessórios',
  store_address TEXT NOT NULL DEFAULT 'Rua Exemplo, 123 - Centro',
  store_cep TEXT NOT NULL DEFAULT '01000-000',
  default_freight NUMERIC(10,2) NOT NULL DEFAULT 15.00,
  hero_image TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Freight zones
CREATE TABLE public.freight_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  distance_min NUMERIC(10,2) NOT NULL DEFAULT 0,
  distance_max NUMERIC(10,2) NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Coupons
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: public read for all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freight_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public read freight_zones" ON public.freight_zones FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);

-- Admin write policies (authenticated users for now, will restrict to admin role later)
CREATE POLICY "Auth insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete products" ON public.products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert store_settings" ON public.store_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update store_settings" ON public.store_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth insert freight_zones" ON public.freight_zones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update freight_zones" ON public.freight_zones FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete freight_zones" ON public.freight_zones FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert coupons" ON public.coupons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update coupons" ON public.coupons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete coupons" ON public.coupons FOR DELETE TO authenticated USING (true);
