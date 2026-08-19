-- 1. Remove public direct access to the base table (contains internal cost/agio)
DROP POLICY IF EXISTS "Public can read published garimpos" ON public.garimpos;
REVOKE SELECT ON public.garimpos FROM anon, authenticated;

-- 2. Public view becomes the only public read path; definer semantics so it works without table grants
ALTER VIEW public.garimpos_public SET (security_invoker = false);
GRANT SELECT ON public.garimpos_public TO anon, authenticated;
GRANT ALL ON public.garimpos TO service_role;

-- 3. Storage: only images belonging to published garimpos are readable
DROP POLICY IF EXISTS "Public can read garimpo images" ON storage.objects;
CREATE POLICY "Public can read published garimpo images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'garimpo-images'
  AND EXISTS (
    SELECT 1 FROM public.garimpos g
    WHERE g.published = true
      AND g.code = split_part(storage.objects.name, '/', 1)
  )
);