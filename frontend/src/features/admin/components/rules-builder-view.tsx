"use client"

import React from "react"

export default function RulesBuilderView() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Rules</h1>
          <p className="text-zinc-500 mt-2">Configure conditional routing for expense approvals.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow">
          Add Rule Step
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium">Drag and drop builder</h3>
        <p className="text-zinc-500 mt-2">This is where the dnd-kit sortable interface will go for rule creation.</p>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        Approval flow is sequential (Manager → Finance → Director). Each step must approve before moving to the next.
        Conditional short-circuit rules are supported, for example: if CFO approves, the request is auto-approved.
      </div>
    </div>
  )
}
