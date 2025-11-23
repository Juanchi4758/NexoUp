"use client"

import type React from "react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { DollarSign, CreditCard, Smartphone } from "lucide-react"
import type { Customer } from "@/lib/types"

interface CreditoPaymentProps {
  customer: Customer
  onClose: () => void
}

export function CreditoPayment({ customer, onClose }: CreditoPaymentProps) {
  const { addCreditoPayment } = useStore()
  const [amount, setAmount] = useState<number>(customer.current_debt)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (amount <= 0) {
      alert("El monto debe ser mayor a cero")
      return
    }

    if (amount > customer.current_debt) {
      if (
        !confirm(
          `El monto (${formatPrice(amount)}) es mayor a la deuda (${formatPrice(customer.current_debt)}). ¿Continuar?`,
        )
      ) {
        return
      }
    }

    addCreditoPayment(customer.id, amount, paymentMethod)
    alert("Pago registrado exitosamente")
    onClose()
  }

  const quickAmounts = [
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "Todo", value: customer.current_debt },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Abono</DialogTitle>
          <DialogDescription className="text-lg pt-2">
            Cliente: <span className="font-semibold">{customer.name}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-6 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg text-muted-foreground">Deuda Actual:</span>
              <span className="text-3xl font-bold text-destructive">{formatPrice(customer.current_debt)}</span>
            </div>
            {amount > 0 && amount <= customer.current_debt && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-lg text-muted-foreground">Deuda Restante:</span>
                <span className="text-2xl font-bold text-accent">{formatPrice(customer.current_debt - amount)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg">
              Monto a Abonar *
            </Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="h-14 text-2xl font-bold text-center"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((qa) => (
              <Button
                key={qa.label}
                type="button"
                variant="outline"
                onClick={() => setAmount(qa.value)}
                className="h-12 text-base"
              >
                {qa.label === "Todo" ? qa.label : formatPrice(qa.value)}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            <Label className="text-lg">Método de Pago *</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
                className="h-16 text-base flex-col"
              >
                <DollarSign className="h-6 w-6 mb-1" />
                Efectivo
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="h-16 text-base flex-col"
              >
                <CreditCard className="h-6 w-6 mb-1" />
                Tarjeta
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "transfer" ? "default" : "outline"}
                onClick={() => setPaymentMethod("transfer")}
                className="h-16 text-base flex-col"
              >
                <Smartphone className="h-6 w-6 mb-1" />
                Transfer.
              </Button>
            </div>
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
              Registrar Abono
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
