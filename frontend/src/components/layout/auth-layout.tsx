import React from "react"
import { ShieldCheck } from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* Top Right Actions */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8 z-50">
        <ModeToggle />
      </div>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 dark:bg-zinc-950 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-120 w-120 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 text-primary-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">FlowReimburse</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mt-24 leading-tight">
            Streamline your expense reporting.
          </h1>
          <p className="mt-6 text-zinc-300 max-w-sm text-lg leading-relaxed">
            Submit, track, and approve employee reimbursements seamlessly. No more paper receipts or lost email threads.
          </p>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-zinc-500">
          &copy; {new Date().getFullYear()} FlowReimburse. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
