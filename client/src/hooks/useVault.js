import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { handleApiError } from '../utils/errorHandler';

// ── QUERY KEYS — centralised so invalidation is consistent ──
export const QUERY_KEYS = {
  secrets:   (filters) => ['secrets', filters],
  secret:    (id)      => ['secret',  id],
  apiKeys:              ['apiKeys'],
  auditLogs: (page)    => ['auditLogs', page],
};

// ── Fetch secrets list ─────────────────────────────────────
export function useSecrets(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.secrets(filters),
    queryFn: async () => {
      const { data } = await axios.get('/vault', { params: filters });
      return data.data.secrets || [];
    },
  });
}

// ── Fetch single secret (with encrypted blob) ──────────────
export function useSecret(id) {
  return useQuery({
    queryKey: QUERY_KEYS.secret(id),
    queryFn: async () => {
      const { data } = await axios.get(`/vault/${id}`);
      return data.data.secret;
    },
    enabled: !!id,   // only fetch if id exists
  });
}

// ── Create secret mutation ─────────────────────────────────
export function useCreateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => axios.post('/vault', payload),
    onSuccess: () => {
      // Invalidate all secrets queries → triggers automatic refetch
      qc.invalidateQueries({ queryKey: ['secrets'] });
      toast.success('Secret encrypted and stored!');
    },
    onError: (err) => handleApiError(err, 'Failed to create secret'),
  });
}

// ── Delete secret mutation ─────────────────────────────────
export function useDeleteSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/vault/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
      toast.success('Secret deleted');
    },
    onError: (err) => handleApiError(err, 'Delete failed'),
  });
}

// ── Update secret mutation ─────────────────────────────────
export function useUpdateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => axios.put(`/vault/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
    },
    onError: (err) => handleApiError(err, 'Update failed'),
  });
}

// ── API keys ───────────────────────────────────────────────
export function useApiKeys() {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys,
    queryFn: async () => {
      const { data } = await axios.get('/apikeys');
      return data.data.apiKeys || [];
    },
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => axios.post('/apikeys', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
    },
    onError: (err) => handleApiError(err, 'Failed to create key'),
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/apikeys/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys });
      toast.success('Key revoked');
    },
    onError: (err) => handleApiError(err, 'Revoke failed'),
  });
}

// ── Audit logs ─────────────────────────────────────────────
export function useAuditLogs(page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.auditLogs(page),
    queryFn: async () => {
      const { data } = await axios.get(`/audit?page=${page}&limit=20`);
      return data.data;
    },
  });
}