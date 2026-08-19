ALTER TYPE public.garimpo_status ADD VALUE IF NOT EXISTS 'SOLD';
ALTER TABLE public.garimpos ADD COLUMN IF NOT EXISTS sold_at timestamp with time zone;