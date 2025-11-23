"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Plus, Search, User, DollarSign, Phone, MapPin, Pencil } from "lucide-react"
import { CustomerForm } from "./customer-form"
import { CreditoPayment } from "./credit-payment"
import type { Customer } from "@/lib/types"

export function CustomerList() {
  const { customers } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDebtStatus = (customer: Customer) => {
    const percentage = (customer.current_debt / customer.credit_limit) * 100
    if (customer.current_debt === 0) return "none"
    if (percentage >= 100) return "critical"
    if (percentage >= 80) return "high"
    if (percentage >= 50) return "medium"
    return "low"
  }

  const getDebtBadge = (customer: Customer) => {
    const status = getDebtStatus(customer)
    const variants = {
      none: "secondary",
      low: "secondary",
      medium: "default",
      high: "default",
      critical: "destructive",
    }
    const labels = {
      none: "Sin Deuda",
      low: "Deuda Baja",
      medium: "Deuda Media",
      high: "Deuda Alta",
      critical: "Límite Alcanzado",
    }
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>
  }

  const totalDebt = customers.reduce((sum, c) => sum + c.current_debt, 0)
  const customersWithDebt = customers.filter((c) => c.current_debt > 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold text-balance">Clientes y Créditos</h2>
        <Button
          size="lg"
          onClick={() => {
            setEditingCustomer(null)
            setShowForm(true)
          }}
          className="text-lg h-14 px-8"
        >
          <Plus className="mr-2 h-6 w-6" />
          Agregar Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground font-normal">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground font-normal">Clientes con Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{customersWithDebt}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground font-normal">Deuda Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{formatPrice(totalDebt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, teléfono o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-14 h-14 text-lg"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground text-center">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-balance leading-tight flex items-center gap-2">
                    <User className="h-6 w-6 flex-shrink-0" />
                    {customer.name}
                  </CardTitle>
                  {getDebtBadge(customer)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <Phone className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Deuda Actual:</span>
                    <span
                      className={`text-2xl font-bold ${customer.current_debt > 0 ? "text-destructive" : "text-accent"}`}
                    >
                      {formatPrice(customer.current_debt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Límite de Crédito:</span>
                    <span className="text-lg font-medium">{formatPrice(customer.credit_limit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Disponible:</span>
                    <span className="text-lg font-medium text-accent">
                      {formatPrice(customer.credit_limit - customer.current_debt)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {customer.current_debt > 0 && (
                    <Button size="lg" className="flex-1 text-base h-12" onClick={() => setPaymentCustomer(customer)}>
                      <DollarSign className="mr-2 h-5 w-5" />
                      Abonar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className={`${customer.current_debt > 0 ? "flex-none" : "flex-1"} text-base h-12`}
                    onClick={() => {
                      setEditingCustomer(customer)
                      setShowForm(true)
                    }}
                  >
                    <Pencil className="mr-2 h-5 w-5" />
                    {customer.current_debt > 0 ? "" : "Editar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => {
            setShowForm(false)
            setEditingCustomer(null)
          }}
        />
      )}

      {paymentCustomer && <CreditoPayment customer={paymentCustomer} onClose={() => setPaymentCustomer(null)} />}
    </div>
  )
}
