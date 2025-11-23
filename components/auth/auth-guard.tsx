"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, initializeAuth } from "@/lib/auth"
import { useStore } from "@/lib/store"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { loadProducts, loadCustomers, loadSales, loadAlerts, checkAndGenerateAlerts } = useStore()

  useEffect(() => {
    const checkAuth = async () => {
      // Initialize auth system (creates default admin if needed)
      initializeAuth()

      // Check authentication
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push("/login")
      } else {
        // Load initial data from database
        await Promise.all([loadProducts(), loadCustomers(), loadSales(), loadAlerts()])

        // Generate alerts based on loaded data
        await checkAndGenerateAlerts()

        setLoading(false)
      }
    }

    checkAuth()
  }, [router, loadProducts, loadCustomers, loadSales, loadAlerts, checkAndGenerateAlerts])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-xl text-muted-foreground">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
