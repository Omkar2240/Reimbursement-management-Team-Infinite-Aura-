"use client"

import React from "react"
import { useExpenses } from "@/hooks/expenses/use-expenses"
import ExpenseStatusBadge from "./expense-status-badge"

export default function ExpenseDashboardView() {
  const { data: expenses, isLoading } = useExpenses()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Expenses</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow">
          Create Expense
        </button>
      </div>

      {isLoading ? (
        <div>Loading expenses...</div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-500">Title</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Amount</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Date</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses?.length ? expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{expense.title}</td>
                  <td className="px-6 py-4">
                    {expense.currency} {expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <ExpenseStatusBadge status={expense.status} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
