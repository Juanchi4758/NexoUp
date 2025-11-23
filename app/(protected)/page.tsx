"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function HomePage() {
  const { checkAndGenerateAlerts } = useStore()

  useEffect(() => {
    checkAndGenerateAlerts()
  }, [checkAndGenerateAlerts])

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Panel Principal
          </h1>
          <p className="text-xl text-slate-300">Bienvenido al sistema de gestión NEXOVENTIS</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </main>
  )
}
