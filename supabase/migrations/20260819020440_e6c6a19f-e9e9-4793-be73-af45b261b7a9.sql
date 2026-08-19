-- Back to invoker semantics (no SECURITY DEFINER view)
ALTER VIEW public.garimpos_public SET (security_invoker = true);

-- Column-level grants: internal_base_cost / internal_agio intentionally excluded
GRANT SELECT (
  id, code, vehicle_name, year, mileage_km, transmission, fuel, location,
  fipe_value, market_value, garimpo_value, discount_fipe_percent,
  market_difference, main_image_url, positives, attention_points,
  garimpo_note, access_type, status, published, published_at, closed_at,
  created_at, updated_at
) ON public.garimpos TO anon, authenticated;

CREATE POLICY "Public can read published garimpos"
ON public.garimpos FOR SELECT TO anon, authenticated
USING (published = true);