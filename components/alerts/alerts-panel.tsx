"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Package, Calendar, UserCircle, X } from "lucide-react"

export function AlertsPanel() {
  const { alerts, markAlertAsRead } = useStore()

  const unreadAlerts = alerts.filter((a) => !a.is_read)
  const readAlerts = alerts.filter((a) => a.is_read)

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <Package className="h-6 w-6" />
      case "expiry_warning":
        return <Calendar className="h-6 w-6" />
      case "high_debt":
        return <UserCircle className="h-6 w-6" />
      default:
        return <AlertTriangle className="h-6 w-6" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    }
    const labels = {
      high: "Urgente",
      medium: "Importante",
      low: "Info",
    }
    return (
      <Badge variant={variants[severity as keyof typeof variants] as any}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      low_stock: "Stock Bajo",
      expiry_warning: "Próximo a Vencer",
      high_debt: "Deuda Alta",
      system: "Sistema",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Bell className="h-8 w-8" />
        <div>
          <h2 className="text-3xl font-bold">Alertas y Notificaciones</h2>
          <p className="text-lg text-muted-foreground">
            {unreadAlerts.length} alerta{unreadAlerts.length !== 1 ? "s" : ""} sin leer
          </p>
        </div>
      </div>

      {unreadAlerts.length === 0 && readAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground text-center">No hay alertas en este momento</p>
            <p className="text-base text-muted-foreground text-center mt-2">
              Las alertas aparecerán aquí cuando haya productos con stock bajo, próximos a vencer o clientes con deuda
              alta
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {unreadAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">Sin Leer</h3>
              {unreadAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getSeverityBadge(alert.severity)}
                              <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                            </div>
                            <p className="text-xl font-medium text-balance leading-relaxed">{alert.message}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => markAlertAsRead(alert.id)}
                            className="h-10 w-10 flex-shrink-0"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {readAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-muted-foreground">Leídas</h3>
              {readAlerts.slice(0, 10).map((alert) => (
                <Card key={alert.id} className="opacity-60 hover:opacity-100 transition-opacity">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getSeverityBadge(alert.severity)}
                            <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                          </div>
                          <p className="text-lg text-balance leading-relaxed">{alert.message}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
