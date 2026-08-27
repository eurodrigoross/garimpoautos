CREATE TYPE public.user_deal_source AS ENUM ('GARIMPO_AUTO', 'MANUAL');
CREATE TYPE public.user_deal_status AS ENUM ('ANALYSIS', 'ACQUIRED', 'PREPARING', 'FOR_SALE', 'SOLD');

CREATE TABLE public.user_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source public.user_deal_source NOT NULL DEFAULT 'MANUAL',
  garimpo_id uuid,
  garimpo_code text,
  vehicle_name text NOT NULL,
  year_model text,
  image_url text,
  acquisition_value numeric NOT NULL DEFAULT 0,
  fipe_value numeric,
  transport_cost numeric NOT NULL DEFAULT 0,
  documentation_cost numeric NOT NULL DEFAULT 0,
  repair_cost numeric NOT NULL DEFAULT 0,
  other_cost numeric NOT NULL DEFAULT 0,
  status public.user_deal_status NOT NULL DEFAULT 'ANALYSIS',
  notes text,
  sale_value numeric,
  sale_date date,
  sale_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_deals_user_id_idx ON public.user_deals (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_deals TO authenticated;
GRANT ALL ON public.user_deals TO service_role;

ALTER TABLE public.user_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own deals" ON public.user_deals
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Members insert own deals" ON public.user_deals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Members update own deals" ON public.user_deals
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Members delete own deals" ON public.user_deals
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER update_user_deals_updated_at
  BEFORE UPDATE ON public.user_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();