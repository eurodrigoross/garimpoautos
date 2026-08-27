import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import {
  createMyDeal,
  deleteMyDeal,
  getMyDeal,
  listMyDeals,
  updateMyDeal,
} from "@/lib/deals.functions";

export const DEAL_KEYS = {
  all: ["prime", "deals"] as const,
  one: (id: string) => ["prime", "deal", id] as const,
};

export function useMyDeals() {
  const fn = useServerFn(listMyDeals);
  return useQuery({ queryKey: DEAL_KEYS.all, queryFn: () => fn(), retry: false });
}

export function useMyDeal(id: string) {
  const fn = useServerFn(getMyDeal);
  return useQuery({
    queryKey: DEAL_KEYS.one(id),
    queryFn: () => fn({ data: { id } }),
    retry: false,
    enabled: Boolean(id),
  });
}

export function useCreateDeal() {
  const fn = useServerFn(createMyDeal);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof fn>[0] extends { data: infer D } ? D : never) =>
      fn({ data } as never),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: DEAL_KEYS.all });
    },
  });
}

export function useUpdateDeal() {
  const fn = useServerFn(updateMyDeal);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => fn({ data } as never),
    onSuccess: (deal) => {
      void qc.invalidateQueries({ queryKey: DEAL_KEYS.all });
      if (deal?.id) void qc.invalidateQueries({ queryKey: DEAL_KEYS.one(deal.id) });
    },
  });
}

export function useDeleteDeal() {
  const fn = useServerFn(deleteMyDeal);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: DEAL_KEYS.all });
    },
  });
}
