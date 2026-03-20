-- Align RLS with current app behavior: open /admin without auth.
-- Public users can read/write managed tables and hero-images bucket.

-- Products
DROP POLICY IF EXISTS "Auth insert products" ON public.products;
DROP POLICY IF EXISTS "Auth update products" ON public.products;
DROP POLICY IF EXISTS "Auth delete products" ON public.products;
DROP POLICY IF EXISTS "Public insert products" ON public.products;
DROP POLICY IF EXISTS "Public update products" ON public.products;
DROP POLICY IF EXISTS "Public delete products" ON public.products;

CREATE POLICY "Public insert products"
ON public.products
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update products"
ON public.products
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete products"
ON public.products
FOR DELETE
TO public
USING (true);

-- Store settings
DROP POLICY IF EXISTS "Auth insert store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Auth update store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public insert store_settings" ON public.store_settings;
DROP POLICY IF EXISTS "Public update store_settings" ON public.store_settings;

CREATE POLICY "Public insert store_settings"
ON public.store_settings
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update store_settings"
ON public.store_settings
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Freight zones
DROP POLICY IF EXISTS "Auth insert freight_zones" ON public.freight_zones;
DROP POLICY IF EXISTS "Auth update freight_zones" ON public.freight_zones;
DROP POLICY IF EXISTS "Auth delete freight_zones" ON public.freight_zones;
DROP POLICY IF EXISTS "Public insert freight_zones" ON public.freight_zones;
DROP POLICY IF EXISTS "Public update freight_zones" ON public.freight_zones;
DROP POLICY IF EXISTS "Public delete freight_zones" ON public.freight_zones;

CREATE POLICY "Public insert freight_zones"
ON public.freight_zones
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update freight_zones"
ON public.freight_zones
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete freight_zones"
ON public.freight_zones
FOR DELETE
TO public
USING (true);

-- Coupons
DROP POLICY IF EXISTS "Auth insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Auth update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Auth delete coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public delete coupons" ON public.coupons;

CREATE POLICY "Public insert coupons"
ON public.coupons
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update coupons"
ON public.coupons
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete coupons"
ON public.coupons
FOR DELETE
TO public
USING (true);

-- Hero slides
DROP POLICY IF EXISTS "Auth insert hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Auth update hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Auth delete hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public insert hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public update hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public delete hero_slides" ON public.hero_slides;

CREATE POLICY "Public insert hero_slides"
ON public.hero_slides
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update hero_slides"
ON public.hero_slides
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete hero_slides"
ON public.hero_slides
FOR DELETE
TO public
USING (true);

-- Storage bucket hero-images
DROP POLICY IF EXISTS "Auth insert hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth update hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Public insert hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete hero-images" ON storage.objects;

CREATE POLICY "Public insert hero-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public update hero-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public delete hero-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'hero-images');
