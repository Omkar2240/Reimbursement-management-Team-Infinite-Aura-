import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteApprovalRule,
  getApprovalRules,
  postApprovalRule,
  putApprovalRule,
  type ApprovalRulePayload,
} from '@/services/approval-rule.service';

export const useApprovalRules = (companyId?: number) => {
  return useQuery({
    queryKey: ['approval-rules', companyId],
    queryFn: () => getApprovalRules(companyId as number),
    enabled: !!companyId,
  });
};

export const useCreateApprovalRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApprovalRulePayload) => postApprovalRule(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['approval-rules', vars.companyId] });
    },
  });
};

export const useUpdateApprovalRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ApprovalRulePayload> }) =>
      putApprovalRule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-rules'] });
    },
  });
};

export const useDeleteApprovalRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApprovalRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-rules'] });
    },
  });
};
