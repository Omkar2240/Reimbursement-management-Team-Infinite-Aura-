import { z } from 'zod';

export const subAdminRoleSchema = z.enum(['MANAGER', 'EMPLOYEE', 'FINANCE', 'DIRECTOR']);

export const subAdminFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: subAdminRoleSchema,
  is_active: z.boolean().default(true)
});

export const updateSubAdminStatusSchema = z.object({
  is_active: z.boolean()
});

export type SubAdminFormValues = z.infer<typeof subAdminFormSchema>;
export type UpdateSubAdminStatusFormValues = z.infer<typeof updateSubAdminStatusSchema>;
