"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"
import { useAuth } from "@/providers/auth-provider"
import {
  useApprovalRules,
  useCreateApprovalRule,
  useDeleteApprovalRule,
  useUpdateApprovalRule,
} from "@/hooks/admin/use-approval-rules"
import type { ApprovalRule } from "@/services/approval-rule.service"

const approverRoleOptions = ["MANAGER", "FINANCE", "DIRECTOR", "CFO", "ADMIN"]

export default function RulesBuilderView() {
  const { user } = useAuth()
  const companyId = user?.companyId

  const [stepNumber, setStepNumber] = useState("1")
  const [approverRole, setApproverRole] = useState("MANAGER")
  const [percentageThreshold, setPercentageThreshold] = useState("60")
  const [allowCfoShortcut, setAllowCfoShortcut] = useState(true)
  const [isManagerApprover, setIsManagerApprover] = useState(true)

  const { data, isLoading } = useApprovalRules(companyId)
  const createRule = useCreateApprovalRule()
  const deleteRule = useDeleteApprovalRule()
  const updateRule = useUpdateApprovalRule()

  const rows = useMemo<ApprovalRule[]>(() => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data?.rows)) return data.data.rows
    return []
  }, [data])

  const parsedStepNumber = Number(stepNumber)
  const parsedThreshold = Number(percentageThreshold)
  const canCreateRule =
    Number.isInteger(parsedStepNumber) &&
    parsedStepNumber > 0 &&
    approverRole.trim().length > 0 &&
    Number.isFinite(parsedThreshold) &&
    parsedThreshold >= 1 &&
    parsedThreshold <= 100

  const onCreate = async () => {
    if (!companyId || !canCreateRule) return
    await createRule.mutateAsync({
      companyId,
      stepNumber: parsedStepNumber,
      approverRole,
      percentageThreshold: parsedThreshold,
      allowCfoShortcut,
      isManagerApprover,
      isActive: true,
    })
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Rules</h1>
          <p className="text-zinc-500 mt-2">
            Configure sequential and conditional routing for expense approvals.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Create Rule Step</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Step Number</Label>
            <Input value={stepNumber} onChange={(e) => setStepNumber(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Approver Role</Label>
            <SearchableDropdown
              options={approverRoleOptions}
              value={approverRole}
              onChange={setApproverRole}
              placeholder="Select role"
            />
          </div>

          <div className="space-y-2">
            <Label>Percentage Threshold</Label>
            <Input
              value={percentageThreshold}
              onChange={(e) => setPercentageThreshold(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            variant={allowCfoShortcut ? "default" : "outline"}
            onClick={() => setAllowCfoShortcut((v) => !v)}
          >
            CFO Shortcut: {allowCfoShortcut ? "Enabled" : "Disabled"}
          </Button>

          <Button
            type="button"
            variant={isManagerApprover ? "default" : "outline"}
            onClick={() => setIsManagerApprover((v) => !v)}
          >
            Manager Approver: {isManagerApprover ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <Button className="mt-4" onClick={onCreate} disabled={!canCreateRule || createRule.isPending}>
          {createRule.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Rule Step
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Configured Rules</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-zinc-500">Loading rules...</p>
        ) : rows.length ? (
          <div className="mt-4 space-y-3">
            {rows.map((rule) => (
              <div key={rule.id} className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium">
                  Step {rule.stepNumber}: {rule.approverRole}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Threshold: {rule.percentageThreshold ?? 0}% | Manager approver:{" "}
                  {rule.isManagerApprover ? "Yes" : "No"} | CFO shortcut:{" "}
                  {rule.allowCfoShortcut ? "Yes" : "No"}
                </p>
                <Button
                  className="mt-3"
                  variant={rule.isActive ? "outline" : "default"}
                  size="sm"
                  onClick={() =>
                    updateRule.mutate({
                      id: rule.id,
                      payload: { isActive: !rule.isActive }
                    })
                  }
                >
                  {rule.isActive ? "Disable" : "Enable"}
                </Button>
                <Button
                  className="mt-3 ml-2"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteRule.mutate(rule.id)}
                  disabled={deleteRule.isPending}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">No rules configured yet.</p>
        )}
      </div>
    </div>
  )
}
