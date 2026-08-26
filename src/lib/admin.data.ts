import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import {
  checkAdmin,
  deleteGarimpo,
  getGarimpo,
  listGarimpos,
  listMembers,
  setMembership,
  updateMember,
  setMemberBlocked,
  deleteMember,
  updateGarimpo,
  uploadGarimpoImage,
  type AdminGarimpo,
  type GarimpoPatch,
} from "@/lib/admin.functions";

export const ADMIN_KEYS = {
  me: ["admin", "me"] as const,
  list: ["admin", "garimpos"] as const,
  one: (id: string) => ["admin", "garimpo", id] as const,
};

export function useAdminSession() {
  const fn = useServerFn(checkAdmin);
  return useQuery({ queryKey: ADMIN_KEYS.me, queryFn: () => fn(), retry: false, staleTime: 60_000 });
}

export function useAdminGarimpos() {
  const fn = useServerFn(listGarimpos);
  return useQuery({ queryKey: ADMIN_KEYS.list, queryFn: () => fn(), retry: false });
}

export function useAdminGarimpo(id: string) {
  const fn = useServerFn(getGarimpo);
  return useQuery({
    queryKey: ADMIN_KEYS.one(id),
    queryFn: () => fn({ data: { id } }),
    retry: false,
    enabled: Boolean(id),
  });
}

export function useUpdateGarimpo(successMessage = "Garimpo atualizado.") {
  const fn = useServerFn(updateGarimpo);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: GarimpoPatch) => fn({ data: patch }) as Promise<AdminGarimpo>,
    onSuccess: (saved) => {
      qc.setQueryData(ADMIN_KEYS.one(saved.id), saved);
      void qc.invalidateQueries({ queryKey: ADMIN_KEYS.list });
      void qc.invalidateQueries({ queryKey: ["garimpos-public"] });
      toast.success(successMessage);
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao atualizar."),
  });
}

export function useDeleteGarimpo() {
  const fn = useServerFn(deleteGarimpo);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn({ data: { id } }) as Promise<{ ok: boolean }>,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ADMIN_KEYS.list });
      void qc.invalidateQueries({ queryKey: ["garimpos-public"] });
      toast.success("Garimpo excluído definitivamente.");
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao excluir."),
  });
}

export function useUploadGarimpoImage() {
  const fn = useServerFn(uploadGarimpoImage);
  return useMutation({
    mutationFn: async (input: { file: File; code: string }) => {
      const buffer = await input.file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i] as number);
      return fn({
        data: { code: input.code, contentType: input.file.type, base64: btoa(binary) },
      }) as Promise<{ main_image_url: string; path: string }>;
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao enviar a foto."),
  });
}

export type { AdminGarimpo };

/* ----------------------------- Membros Prime ------------------------------ */
export const MEMBER_KEYS = { list: ["admin", "members"] as const };

export function useAdminMembers() {
  const fn = useServerFn(listMembers);
  return useQuery({ queryKey: MEMBER_KEYS.list, queryFn: () => fn(), retry: false });
}

export function useSetMembership() {
  const fn = useServerFn(setMembership);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { user_id: string; active: boolean; expires_at?: string | null }) =>
      fn({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: MEMBER_KEYS.list });
      toast.success("Acesso Prime atualizado.");
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao atualizar acesso."),
  });
}

export function useUpdateMember() {
  const fn = useServerFn(updateMember);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      user_id: string;
      email?: string | null;
      full_name?: string | null;
      password?: string;
    }) => fn({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: MEMBER_KEYS.list });
      toast.success("Perfil atualizado.");
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao atualizar perfil."),
  });
}

export function useSetMemberBlocked() {
  const fn = useServerFn(setMemberBlocked);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { user_id: string; blocked: boolean }) => fn({ data: input }),
    onSuccess: (_d, v) => {
      void qc.invalidateQueries({ queryKey: MEMBER_KEYS.list });
      toast.success(v.blocked ? "Membro inativado." : "Membro reativado.");
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao alterar status."),
  });
}

export function useDeleteMember() {
  const fn = useServerFn(deleteMember);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { user_id: string }) => fn({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: MEMBER_KEYS.list });
      toast.success("Membro excluído.");
    },
    onError: (error: Error) => toast.error(error.message || "Erro ao excluir membro."),
  });
}

export type { AdminMember } from "@/lib/admin.functions";
