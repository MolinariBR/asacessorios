
-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- Allow anyone to read hero images
CREATE POLICY "Public read hero-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'hero-images');

-- Allow authenticated users to upload/update/delete hero images
CREATE POLICY "Auth insert hero-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-images');
CREATE POLICY "Auth update hero-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero-images') WITH CHECK (bucket_id = 'hero-images');
CREATE POLICY "Auth delete hero-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero-images');
