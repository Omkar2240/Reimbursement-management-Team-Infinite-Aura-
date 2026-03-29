import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  getExpenses, 
  getExpenseById, 
  createExpense, 
  approveExpense, 
  rejectExpense,
  getPendingApprovals,
  getTeamExpenses,
  getExpenseApprovalChain,
  convertExpense,
  uploadExpenseReceipt
} from "@/services/expense.service"
import { ExpenseFormValues } from "@/schemas/expense.schema"

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  })
}

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ExpenseFormValues) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}

export const useApproveExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}

export const useRejectExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectExpense(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ["expenses", "pending-approvals"],
    queryFn: getPendingApprovals,
  })
}

export const useTeamExpenses = () => {
  return useQuery({
    queryKey: ["expenses", "team-expenses"],
    queryFn: getTeamExpenses,
  })
}

export const useExpenseApprovalChain = (id: string) => {
  return useQuery({
    queryKey: ["expenses", id, "approval-chain"],
    queryFn: () => getExpenseApprovalChain(id),
    enabled: !!id,
  })
}

export const useConvertExpense = () => {
  return useMutation({
    mutationFn: ({ id, toCurrency }: { id: string; toCurrency: string }) =>
      convertExpense(id, toCurrency),
  })
}

export const useUploadExpenseReceipt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      uploadExpenseReceipt(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}
