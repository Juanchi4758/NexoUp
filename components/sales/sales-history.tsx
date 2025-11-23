"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { Receipt, Calendar, DollarSign, User } from "lucide-react"

export function SalesHistory() {
  const { sales } = useStore()
  const [filterMethod, setFilterMethod] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSales = sales.filter((sale) => {
    const matchesMethod = filterMethod === "all" || sale.payment_method === filterMethod
    const matchesStatus = filterStatus === "all" || sale.status === filterStatus
    const matchesSearch =
      !searchTerm ||
      sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.includes(searchTerm)
    return matchesMethod && matchesStatus && matchesSearch
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0)

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    }
    const labels = {
      completed: "Completada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>
    )
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      credito: "Crédito",
    }
    return labels[method as keyof typeof labels] || method
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-balance">Historial de Ventas</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground font-normal">Total Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatPrice(totalSales)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground font-normal">Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{filteredSales.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          type="text"
          placeholder="Buscar por cliente o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 text-lg md:flex-1"
        />

        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="h-14 text-lg md:w-[200px]">
            <SelectValue placeholder="Método de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-lg py-3">
              Todos
            </SelectItem>
            <SelectItem value="cash" className="text-lg py-3">
              Efectivo
            </SelectItem>
            <SelectItem value="card" className="text-lg py-3">
              Tarjeta
            </SelectItem>
            <SelectItem value="transfer" className="text-lg py-3">
              Transferencia
            </SelectItem>
            <SelectItem value="credito" className="text-lg py-3">
              Crédito
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-14 text-lg md:w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-lg py-3">
              Todos
            </SelectItem>
            <SelectItem value="completed" className="text-lg py-3">
              Completadas
            </SelectItem>
            <SelectItem value="pending" className="text-lg py-3">
              Pendientes
            </SelectItem>
            <SelectItem value="cancelled" className="text-lg py-3">
              Canceladas
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredSales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground text-center">No se encontraron ventas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredSales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <span className="font-mono text-base text-muted-foreground">#{sale.id.slice(0, 8)}</span>
                      </div>
                      {getStatusBadge(sale.status)}
                      <Badge variant="outline">{getPaymentMethodLabel(sale.payment_method)}</Badge>
                    </div>

                    <div className="flex flex-col gap-1">
                      {sale.customer_name && (
                        <div className="flex items-center gap-2 text-base">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <span>{sale.customer_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>
                          {new Date(sale.sale_date).toLocaleString("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end md:justify-start">
                      <DollarSign className="h-6 w-6 text-primary" />
                      <span className="text-3xl font-bold text-primary">{formatPrice(sale.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
