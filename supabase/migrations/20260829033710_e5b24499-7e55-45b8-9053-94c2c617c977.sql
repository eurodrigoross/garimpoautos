REVOKE ALL ON public.user_deals FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_deals TO authenticated;
GRANT ALL ON public.user_deals TO service_role;