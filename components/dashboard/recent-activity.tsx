"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Receipt, Calendar } from "lucide-react"

export function RecentActivity() {
  const { sales } = useStore()
  const recentSales = sales.slice(0, 5)

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      credito: "Crédito",
    }
    return labels[method as keyof typeof labels] || method
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any} className="text-sm">
        {status === "completed" ? "Completada" : status === "pending" ? "Pendiente" : "Cancelada"}
      </Badge>
    )
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentSales.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 mx-auto text-slate-600 mb-4" />
            <p className="text-lg text-slate-400">No hay ventas registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-lg hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-slate-400">#{sale.id.slice(0, 8)}</span>
                    {getStatusBadge(sale.status)}
                    <Badge variant="outline" className="text-sm border-slate-600 text-slate-300">
                      {getPaymentMethodLabel(sale.payment_method)}
                    </Badge>
                  </div>
                  {sale.customer_name && <p className="text-base font-medium text-white">{sale.customer_name}</p>}
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(sale.sale_date).toLocaleString("es-MX", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {formatPrice(sale.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
