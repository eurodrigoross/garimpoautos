CREATE TYPE public.garimpo_access AS ENUM ('OPEN', 'PRIME');
CREATE TYPE public.garimpo_status AS ENUM ('AVAILABLE', 'RESERVED', 'CLOSED');

CREATE TABLE public.garimpos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  vehicle_name TEXT NOT NULL,
  year TEXT,
  mileage_km TEXT,
  transmission TEXT,
  fuel TEXT,
  location TEXT,
  fipe_value NUMERIC(12,2),
  market_value NUMERIC(12,2),
  internal_base_cost NUMERIC(12,2),
  internal_agio NUMERIC(12,2),
  garimpo_value NUMERIC(12,2),
  discount_fipe_percent NUMERIC(5,2),
  market_difference NUMERIC(12,2),
  main_image_url TEXT,
  positives TEXT[] NOT NULL DEFAULT '{}',
  attention_points TEXT[] NOT NULL DEFAULT '{}',
  garimpo_note TEXT,
  access_type public.garimpo_access NOT NULL DEFAULT 'OPEN',
  status public.garimpo_status NOT NULL DEFAULT 'AVAILABLE',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.garimpos.internal_base_cost IS 'PRIVADO: custo base interno. Nunca exposto na view publica.';
COMMENT ON COLUMN public.garimpos.internal_agio IS 'PRIVADO: agio interno. Nunca exposto na view publica.';
COMMENT ON TABLE public.garimpos IS 'Fonte administrativa dos garimpos. Escrita futura via Edge Function/API autenticada (botao PUBLICAR NO RADAR da extensao) usando service role no servidor.';

CREATE INDEX idx_garimpos_public_listing ON public.garimpos (published, status, access_type, closed_at DESC, published_at DESC);

GRANT ALL ON public.garimpos TO service_role;

ALTER TABLE public.garimpos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published garimpos"
  ON public.garimpos FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_garimpos_updated_at
BEFORE UPDATE ON public.garimpos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.garimpos_public
WITH (security_invoker = true) AS
SELECT
  id, code, vehicle_name, year, mileage_km, transmission, fuel, location,
  fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference,
  main_image_url, positives, attention_points, garimpo_note,
  access_type, status, published_at, closed_at
FROM public.garimpos
WHERE published = true;

COMMENT ON VIEW public.garimpos_public IS 'Fonte publica segura da landing. Exclui colunas internas (internal_base_cost, internal_agio) e registros nao publicados.';

GRANT SELECT ON public.garimpos_public TO anon, authenticated;
GRANT ALL ON public.garimpos_public TO service_role;

INSERT INTO public.garimpos (
  code, vehicle_name, year, mileage_km, transmission, fuel, location,
  fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference,
  access_type, status, published, published_at, closed_at
) VALUES (
  'argo-2024',
  'FIAT ARGO 1.0 FIREFLY FLEX DRIVE MANUAL',
  '2024/2025',
  '40.451 km',
  'MANUAL',
  'ÁLCOOL/GASOLINA',
  'VILA ÁGUA FUNDA — SÃO PAULO / SP',
  71232, 80990, 48275, 32.2, 32715,
  'OPEN', 'CLOSED', true, now(), now()
);