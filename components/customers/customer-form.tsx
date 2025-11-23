"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Customer } from "@/lib/types"

interface CustomerFormProps {
  customer: Customer | null
  onClose: () => void
}

export function CustomerForm({ customer, onClose }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    credit_limit: 500,
    current_debt: 0,
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        credit_limit: customer.credit_limit,
        current_debt: customer.current_debt,
      })
    }
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const customerData = {
      ...formData,
      credit_limit: Number(formData.credit_limit),
      current_debt: Number(formData.current_debt),
    }

    if (customer) {
      updateCustomer(customer.id, customerData)
    } else {
      addCustomer(customerData)
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{customer ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Nombre Completo *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email" className="text-lg">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-lg">
                Dirección
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_limit" className="text-lg">
                Límite de Crédito *
              </Label>
              <Input
                id="credit_limit"
                type="number"
                min="0"
                step="0.01"
                value={formData.credit_limit}
                onChange={(e) => setFormData({ ...formData, credit_limit: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
            </div>

            {customer && (
              <div className="space-y-2">
                <Label htmlFor="current_debt" className="text-lg">
                  Deuda Actual
                </Label>
                <Input
                  id="current_debt"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.current_debt}
                  onChange={(e) => setFormData({ ...formData, current_debt: Number(e.target.value) })}
                  className="h-12 text-lg"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="lg"
              className="text-lg h-12 px-6 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg" className="text-lg h-12 px-6">
              {customer ? "Actualizar" : "Crear"} Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
