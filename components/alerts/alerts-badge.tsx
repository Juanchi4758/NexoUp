"use client"

import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export function AlertsBadge() {
  const { alerts } = useStore()
  const unreadCount = alerts.filter((a) => !a.is_read).length

  if (unreadCount === 0) return null

  return (
    <div className="relative inline-block">
      <Bell className="h-6 w-6" />
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs"
      >
        {unreadCount > 9 ? "9+" : unreadCount}
      </Badge>
    </div>
  )
}
