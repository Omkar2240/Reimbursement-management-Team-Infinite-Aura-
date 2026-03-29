import { z } from "zod"

export const expenseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string(), // ISO string
  description: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export type Expense = ExpenseFormValues & {
  id: string
  status: "pending" | "approved" | "rejected"
  userId: string
  createdAt: string
}
