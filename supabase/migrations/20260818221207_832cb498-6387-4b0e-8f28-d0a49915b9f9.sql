CREATE POLICY "Public can read garimpo images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'garimpo-images');