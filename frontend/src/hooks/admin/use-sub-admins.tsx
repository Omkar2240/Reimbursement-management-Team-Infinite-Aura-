import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteSubAdmin,
  getSubAdminById,
  getManagerTeam,
  getSubAdmins,
  patchAssignManager,
  patchSubAdminStatus,
  postSubAdmin,
  putSubAdmin
} from '@/services/sub-admin.service';
import {
  CreateSubAdminFormValues,
  UpdateSubAdminFormValues,
  UpdateSubAdminStatusFormValues
} from '@/schemas/admin.schema';
import { toast } from 'sonner';

export const useSubAdmins = () => {
  return useQuery({
    queryKey: ['sub-admins'],
    queryFn: getSubAdmins
  });
};

export const useSubAdmin = (id: string) => {
  return useQuery({
    queryKey: ['sub-admins', id],
    queryFn: () => getSubAdminById(id),
    enabled: !!id
  });
};

export const useCreateSubAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubAdminFormValues) => postSubAdmin(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
      toast.success('User created successfully');
    }
  });
};

export const useUpdateSubAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: Partial<UpdateSubAdminFormValues>;
    }) => putSubAdmin(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
      toast.success('User updated successfully');
    }
  });
};

export const useDeleteSubAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubAdmin(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
      toast.success('User deleted successfully');
    }
  });
};

export const useUpdateSubAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: UpdateSubAdminStatusFormValues;
    }) => patchSubAdminStatus(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
      toast.success('Status updated successfully');
    }
  });
};

export const useAssignManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, managerId }: { employeeId: string; managerId: string }) =>
      patchAssignManager(employeeId, managerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sub-admins'] });
      toast.success('Manager assigned successfully');
    }
  });
};

export const useManagerTeam = (managerId: string) => {
  return useQuery({
    queryKey: ['manager-team', managerId],
    queryFn: () => getManagerTeam(managerId),
    enabled: !!managerId
  });
};
