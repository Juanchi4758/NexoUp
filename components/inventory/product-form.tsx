"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product: Product | null
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { addProduct, updateProduct } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    barcode: "",
    category: "",
    current_stock: 0,
    min_stock: 0,
    max_stock: 100,
    unit_price: 0,
    cost_price: 0,
    supplier: "",
    expiry_date: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        barcode: product.barcode || "",
        category: product.category,
        current_stock: product.current_stock,
        min_stock: product.min_stock,
        max_stock: product.max_stock,
        unit_price: product.unit_price,
        cost_price: product.cost_price,
        supplier: product.supplier || "",
        expiry_date: product.expiry_date ? product.expiry_date.split("T")[0] : "",
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      current_stock: Number(formData.current_stock),
      min_stock: Number(formData.min_stock),
      max_stock: Number(formData.max_stock),
      unit_price: Number(formData.unit_price),
      cost_price: Number(formData.cost_price),
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : undefined,
    }

    if (product) {
      updateProduct(product.id, productData)
    } else {
      addProduct(productData)
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">
                Nombre *
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
              <Label htmlFor="category" className="text-lg">
                Categoría *
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-lg">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode" className="text-lg">
                Código de Barras
              </Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-lg">
                Proveedor
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock" className="text-lg">
                Stock Actual *
              </Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock" className="text-lg">
                Stock Mínimo *
              </Label>
              <Input
                id="min_stock"
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_stock" className="text-lg">
                Stock Máximo *
              </Label>
              <Input
                id="max_stock"
                type="number"
                min="0"
                value={formData.max_stock}
                onChange={(e) => setFormData({ ...formData, max_stock: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date" className="text-lg">
                Fecha de Vencimiento
              </Label>
              <Input
                id="expiry_date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price" className="text-lg">
                Precio de Costo *
              </Label>
              <Input
                id="cost_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price" className="text-lg">
                Precio de Venta *
              </Label>
              <Input
                id="unit_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
                required
                className="h-12 text-lg"
              />
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
              {product ? "Actualizar" : "Crear"} Producto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
