import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import {
  checkPrime,
  getPrimeContent,
  getPrimeGarimpo,
  listPrimeContents,
  listPrimeGarimpos,
} from "@/lib/prime.functions";

export const PRIME_KEYS = {
  me: ["prime", "me"] as const,
  garimpos: ["prime", "garimpos"] as const,
  garimpo: (id: string) => ["prime", "garimpo", id] as const,
  contents: ["prime", "contents"] as const,
  content: (slug: string) => ["prime", "content", slug] as const,
};

export function usePrimeSession() {
  const fn = useServerFn(checkPrime);
  return useQuery({ queryKey: PRIME_KEYS.me, queryFn: () => fn(), retry: false, staleTime: 60_000 });
}

export function usePrimeGarimpos(enabled = true) {
  const fn = useServerFn(listPrimeGarimpos);
  return useQuery({ queryKey: PRIME_KEYS.garimpos, queryFn: () => fn(), retry: false, enabled });
}

export function usePrimeGarimpo(id: string) {
  const fn = useServerFn(getPrimeGarimpo);
  return useQuery({
    queryKey: PRIME_KEYS.garimpo(id),
    queryFn: () => fn({ data: { id } }),
    retry: false,
    enabled: Boolean(id),
  });
}

export function usePrimeContents(enabled = true) {
  const fn = useServerFn(listPrimeContents);
  return useQuery({ queryKey: PRIME_KEYS.contents, queryFn: () => fn(), retry: false, enabled });
}

export function usePrimeContent(slug: string) {
  const fn = useServerFn(getPrimeContent);
  return useQuery({
    queryKey: PRIME_KEYS.content(slug),
    queryFn: () => fn({ data: { slug } }),
    retry: false,
    enabled: Boolean(slug),
  });
}
