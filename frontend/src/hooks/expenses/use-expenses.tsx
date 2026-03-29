import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  getExpenses, 
  getExpenseById, 
  createExpense, 
  approveExpense, 
  rejectExpense 
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
