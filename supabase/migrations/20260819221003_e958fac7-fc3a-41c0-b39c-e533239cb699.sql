CREATE OR REPLACE VIEW public.garimpos_public
WITH (security_invoker = true)
AS
SELECT id, code, vehicle_name, year, mileage_km, transmission, fuel, location,
       fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference,
       main_image_url, positives, attention_points, garimpo_note, access_type, status,
       published_at, closed_at, sold_at
FROM public.garimpos
WHERE published = true;

GRANT SELECT ON public.garimpos_public TO anon, authenticated;