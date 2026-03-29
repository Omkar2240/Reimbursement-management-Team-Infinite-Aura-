import { z } from 'zod';

export const subAdminRoleSchema = z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']);

export const createSubAdminFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: subAdminRoleSchema,
  mobileNumber: z.string().min(8, 'Mobile number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  is_active: z.boolean().default(true)
});

export const updateSubAdminFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: subAdminRoleSchema,
  mobileNumber: z.string().min(8, 'Mobile number is required'),
  is_active: z.boolean().default(true)
});

export const updateSubAdminStatusSchema = z.object({
  is_active: z.boolean()
});

export type CreateSubAdminFormValues = z.infer<typeof createSubAdminFormSchema>;
export type UpdateSubAdminFormValues = z.infer<typeof updateSubAdminFormSchema>;
export type UpdateSubAdminStatusFormValues = z.infer<typeof updateSubAdminStatusSchema>;
