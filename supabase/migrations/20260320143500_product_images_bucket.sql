-- Product images bucket for admin uploads from local files.

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public insert product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete product-images" ON storage.objects;

CREATE POLICY "Public read product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Public insert product-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public update product-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public delete product-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'product-images');
