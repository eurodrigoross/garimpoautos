import { createServerFn } from "@tanstack/react-start";
import { maskTeaserRow, type TeaserRow } from "@/lib/garimpos.teaser.shared";

/**
 * Teaser público dos garimpos PRIME.
 * As linhas PRIME não são legíveis por `anon` via RLS; a leitura acontece aqui no
 * servidor com projeção explícita e mascaramento dos números sensíveis enquanto
 * o garimpo não estiver encerrado. Campos internos nunca são selecionados.
 */
export const getPrimeTeasers = createServerFn({ method: "GET" }).handler(
  async (): Promise<TeaserRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("garimpos")
      .select(
        "id, code, vehicle_name, year, mileage_km, transmission, fuel, location, fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference, main_image_url, positives, attention_points, garimpo_note, access_type, status, published_at, closed_at",
      )
      .eq("published", true)
      .eq("access_type", "PRIME");

    if (error) {
      console.error("[garimpos] falha ao carregar teasers prime", error.message);
      return [];
    }

    return (data ?? []).map((row) => maskTeaserRow(row as unknown as TeaserRow));
  },
);
