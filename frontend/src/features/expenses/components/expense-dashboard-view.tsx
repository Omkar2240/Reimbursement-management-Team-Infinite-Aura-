"use client"

import React, { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"
import ExpenseStatusBadge from "./expense-status-badge"
import {
  useApproveExpense,
  useConvertExpense,
  useCreateExpense,
  useExpenseApprovalChain,
  useExpenses,
  usePendingApprovals,
  useRejectExpense,
  useTeamExpenses,
  useUploadExpenseReceipt,
} from "@/hooks/expenses/use-expenses"
import { expenseSchema, type ExpenseFormValues } from "@/schemas/expense.schema"
import { useAuth } from "@/providers/auth-provider"
import type { ConversionResult, ExpenseRule } from "@/services/expense.service"
import type { Expense } from "@/schemas/expense.schema"

const categoryOptions = [
  "Travel",
  "Meals",
  "Accommodation",
  "Supplies",
  "Internet",
  "Other",
]

const currencyOptions = ["USD", "EUR", "INR", "GBP", "AED", "SGD"]

export default function ExpenseDashboardView() {
  const { user } = useAuth()
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>("")
  const [conversionCurrency, setConversionCurrency] = useState("USD")
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptExpenseId, setReceiptExpenseId] = useState<string>("")
  const [form, setForm] = useState<ExpenseFormValues>({
    title: "",
    amount: 0,
    currency: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  })

  const { data: expenseData, isLoading } = useExpenses()
  const { data: pendingData } = usePendingApprovals()
  const { data: teamExpenseData } = useTeamExpenses()
  const { data: chainData } = useExpenseApprovalChain(selectedExpenseId)
  const createExpense = useCreateExpense()
  const approveExpense = useApproveExpense()
  const rejectExpense = useRejectExpense()
  const convertExpense = useConvertExpense()
  const uploadReceipt = useUploadExpenseReceipt()

  const expenses = useMemo<Expense[]>(() => {
    if (Array.isArray(expenseData)) return expenseData
    if (Array.isArray(expenseData?.data)) return expenseData.data
    return []
  }, [expenseData])

  const pendingApprovals = useMemo<Expense[]>(() => {
    if (Array.isArray(pendingData)) return pendingData
    if (Array.isArray(pendingData?.data)) return pendingData.data
    return []
  }, [pendingData])

  const teamExpenses = useMemo<Expense[]>(() => {
    if (Array.isArray(teamExpenseData)) return teamExpenseData
    if (Array.isArray(teamExpenseData?.data)) return teamExpenseData.data
    return []
  }, [teamExpenseData])

  const onCreateExpense = async () => {
    const parsed = expenseSchema.safeParse(form)
    if (!parsed.success) return
    await createExpense.mutateAsync(parsed.data)
    setForm({
      title: "",
      amount: 0,
      currency: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Submit expenses with amount/category/date/description and track sequential approvals.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Submit Expense</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm((s) => ({ ...s, amount: Number(e.target.value) }))}
          />
          <SearchableDropdown
            options={currencyOptions}
            value={form.currency}
            onChange={(value) => setForm((s) => ({ ...s, currency: value }))}
            placeholder="Currency"
          />
          <SearchableDropdown
            options={categoryOptions}
            value={form.category}
            onChange={(value) => setForm((s) => ({ ...s, category: value }))}
            placeholder="Category"
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
          />
          <Input
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />
        </div>
        <Button className="mt-4" onClick={onCreateExpense} disabled={createExpense.isPending}>
          {createExpense.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Expense
        </Button>
      </div>

      {["MANAGER", "ADMIN", "SUPER_ADMIN"].includes((user?.role || "").toUpperCase()) ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <div className="mt-4 space-y-2">
            {pendingApprovals.length ? (
              pendingApprovals.map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div>
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-sm text-zinc-500">
                      {exp.currency} {Number(exp.amount).toFixed(2)} | Step {exp.approvalStep}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={approveExpense.isPending || rejectExpense.isPending}
                      onClick={() => approveExpense.mutate(String(exp.id))}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={approveExpense.isPending || rejectExpense.isPending}
                      onClick={() => rejectExpense.mutate({ id: String(exp.id), reason: "Rejected by approver" })}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedExpenseId(String(exp.id))}
                    >
                      View Chain
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No pending approvals for your role.</p>
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Expense History</h2>
        </div>
        {isLoading ? (
          <div className="p-6">Loading expenses...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3 font-medium text-zinc-500">Title</th>
                  <th className="px-6 py-3 font-medium text-zinc-500">Amount</th>
                  <th className="px-6 py-3 font-medium text-zinc-500">Date</th>
                  <th className="px-6 py-3 font-medium text-zinc-500">Category</th>
                  <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                  <th className="px-6 py-3 font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-6 py-4 font-medium">{expense.title}</td>
                      <td className="px-6 py-4">
                        {expense.currency} {Number(expense.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{expense.category}</td>
                      <td className="px-6 py-4">
                        <ExpenseStatusBadge status={expense.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedExpenseId(String(expense.id))}
                          >
                            Chain
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const result = await convertExpense.mutateAsync({
                                id: String(expense.id),
                                toCurrency: conversionCurrency
                              })
                              setConversionResult(result?.data || result)
                            }}
                          >
                            Convert
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        <p>
          Approval chain is sequential and supports conditional short-circuiting (for example, CFO
          approval can auto-approve).
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span>Convert to:</span>
          <SearchableDropdown
            options={currencyOptions}
            value={conversionCurrency}
            onChange={setConversionCurrency}
            placeholder="Target Currency"
            className="max-w-[220px]"
          />
        </div>
        {chainData?.data ? (
          <p className="mt-3 text-xs">
            Selected chain steps:{" "}
            {(chainData.data.rules || [])
              .map((r: ExpenseRule) => `${r.stepNumber}:${r.approverRole}`)
              .join(" -> ")}
          </p>
        ) : null}
        {conversionResult ? (
          <p className="mt-2 text-xs">
            Converted amount: {conversionResult.to} {Number(conversionResult.amount || 0).toFixed(2)} (rate {conversionResult.rate})
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Receipt OCR Upload</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Expense ID"
            value={receiptExpenseId}
            onChange={(e) => setReceiptExpenseId(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          />
          <Button
            onClick={() => {
              if (!receiptExpenseId || !receiptFile) return
              uploadReceipt.mutate({ id: receiptExpenseId, file: receiptFile })
            }}
            disabled={!receiptExpenseId || !receiptFile || uploadReceipt.isPending}
          >
            {uploadReceipt.isPending ? "Uploading..." : "Upload Receipt"}
          </Button>
        </div>
      </div>

      {["MANAGER", "ADMIN", "SUPER_ADMIN"].includes((user?.role || "").toUpperCase()) ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Team Expenses</h2>
          {teamExpenses.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {teamExpenses.map((exp) => (
                <li key={exp.id} className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
                  {exp.title} - {exp.currency} {Number(exp.amount).toFixed(2)} - {exp.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No team expenses found.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
