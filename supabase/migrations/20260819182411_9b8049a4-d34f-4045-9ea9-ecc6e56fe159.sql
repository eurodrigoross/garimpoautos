-- ============ MEMBERSHIPS ============
DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM ('active','inactive','expired','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'PRIME',
  status public.membership_status NOT NULL DEFAULT 'inactive',
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan)
);

GRANT SELECT ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own membership" ON public.memberships;
CREATE POLICY "Users can read own membership"
  ON public.memberships FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage memberships" ON public.memberships;
CREATE POLICY "Admins manage memberships"
  ON public.memberships FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_memberships_updated_at ON public.memberships;
CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON public.memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_prime_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = _user_id
      AND m.plan = 'PRIME'
      AND m.status = 'active'
      AND (m.expires_at IS NULL OR m.expires_at > now())
  )
$$;

REVOKE ALL ON FUNCTION public.is_prime_member(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_prime_member(uuid) TO authenticated, service_role;

-- ============ GARIMPOS: PRIME GATING ============
DROP POLICY IF EXISTS "Public can read published garimpos" ON public.garimpos;
CREATE POLICY "Published open garimpos are public"
ON public.garimpos FOR SELECT TO anon
USING (published = true AND access_type = 'OPEN');

CREATE POLICY "Members read open and prime garimpos"
ON public.garimpos FOR SELECT TO authenticated
USING (
  published = true
  AND (
    access_type = 'OPEN'
    OR public.is_prime_member(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Teaser público dos garimpos PRIME: sem Valor Garimpo (exceto encerrados)
CREATE OR REPLACE VIEW public.garimpos_teaser AS
SELECT
  g.id,
  g.code,
  g.vehicle_name,
  g.year,
  g.mileage_km,
  g.transmission,
  g.fuel,
  g.location,
  g.fipe_value,
  g.market_value,
  CASE WHEN g.status = 'CLOSED' THEN g.garimpo_value END AS garimpo_value,
  g.discount_fipe_percent,
  CASE WHEN g.status = 'CLOSED' THEN g.market_difference END AS market_difference,
  g.main_image_url,
  g.positives,
  g.attention_points,
  CASE WHEN g.status = 'CLOSED' THEN g.garimpo_note END AS garimpo_note,
  g.access_type,
  g.status,
  g.published_at,
  g.closed_at
FROM public.garimpos g
WHERE g.published = true AND g.access_type = 'PRIME';

ALTER VIEW public.garimpos_teaser SET (security_invoker = false);
GRANT SELECT ON public.garimpos_teaser TO anon, authenticated;

-- ============ CONTEÚDOS PRIME ============
CREATE TABLE IF NOT EXISTS public.prime_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'COMPRA',
  excerpt text,
  content text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.prime_contents TO authenticated;
GRANT ALL ON public.prime_contents TO service_role;

ALTER TABLE public.prime_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Prime members read published contents" ON public.prime_contents;
CREATE POLICY "Prime members read published contents"
  ON public.prime_contents FOR SELECT TO authenticated
  USING (
    published = true
    AND (public.is_prime_member(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Admins manage prime contents" ON public.prime_contents;
CREATE POLICY "Admins manage prime contents"
  ON public.prime_contents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_prime_contents_updated_at ON public.prime_contents;
CREATE TRIGGER update_prime_contents_updated_at
  BEFORE UPDATE ON public.prime_contents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.prime_contents (title, slug, category, excerpt, content, published)
VALUES (
  'Como funciona o Garimpo Prime',
  'como-funciona-o-garimpo-prime',
  'COMPRA',
  'O que você recebe como membro Prime e como usar a área exclusiva no dia a dia.',
  E'O Garimpo Prime é a camada exclusiva do radar da Garimpo Auto.\n\n1. Radar exclusivo\nEnquanto a página pública mostra apenas parte das oportunidades, aqui você vê a ficha completa dos garimpos PRIME: Valor Garimpo, percentual abaixo da FIPE, diferença para a média de mercado, pontos positivos e pontos de atenção.\n\n2. Como agir em um garimpo\nAbra a ficha completa, confira os pontos de atenção e use o botão QUERO ESSE GARIMPO. A mensagem já vai identificada com o código do veículo, para agilizar o atendimento.\n\n3. Calculadora do Garimpo\nAntes de decidir, simule o custo total da operação (compra, transporte, documentação, reparos) e veja o resultado bruto estimado. A simulação usa apenas os valores que você informar e não representa garantia de resultado.\n\n4. Ritmo de publicação\nNão publicamos oportunidade fictícia. Quando não há garimpo novo, o radar aparece vazio — é sinal de que ainda não encontramos algo que valha o seu dinheiro.',
  true
)
ON CONFLICT (slug) DO NOTHING;