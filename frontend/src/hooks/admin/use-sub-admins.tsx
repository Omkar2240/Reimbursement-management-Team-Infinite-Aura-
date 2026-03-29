import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteSubAdmin,
  getSubAdminById,
  getSubAdmins,
  patchSubAdminStatus,
  postSubAdmin,
  putSubAdmin
} from '@/services/sub-admin.service';
import {
  SubAdminFormValues,
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
    mutationFn: (data: SubAdminFormValues) => postSubAdmin(data),
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
      data: Partial<SubAdminFormValues>;
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
