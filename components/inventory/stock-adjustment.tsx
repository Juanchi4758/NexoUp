"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StockAdjustmentProps {
  open: boolean
  onClose: () => void
}

export function StockAdjustment({ open, onClose }: StockAdjustmentProps) {
  const { products, updateStock } = useStore()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(0)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const adjustmentValue = adjustmentType === "add" ? quantity : -quantity
    updateStock(selectedProduct, adjustmentValue)

    // Reset form
    setSelectedProduct("")
    setQuantity(0)
    setReason("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ajustar Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product" className="text-lg">
              Producto *
            </Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} className="text-lg py-3">
                    {product.name} (Stock: {product.current_stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-lg">
              Tipo de Ajuste *
            </Label>
            <Select value={adjustmentType} onValueChange={(v) => setAdjustmentType(v as any)} required>
              <SelectTrigger className="h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add" className="text-lg py-3">
                  Agregar Stock
                </SelectItem>
                <SelectItem value="remove" className="text-lg py-3">
                  Quitar Stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-lg">
              Cantidad *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-lg">
              Motivo
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Inventario, Merma, Devolución..."
              className="h-12 text-lg"
            />
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
              Ajustar Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
