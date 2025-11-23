import type React from "react"
import { NavMenu } from "@/components/layout/nav-menu"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <NavMenu />
        {children}
      </div>
    </AuthGuard>
  )
}
