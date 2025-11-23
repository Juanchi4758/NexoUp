"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Package, AlertTriangle } from "lucide-react"
import { ProductForm } from "./product-form"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/types"

export function ProductList() {
  const { products, deleteProduct } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode?.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (product: Product) => {
    if (product.current_stock === 0) return "out"
    if (product.current_stock <= product.min_stock) return "low"
    if (product.current_stock >= product.max_stock) return "high"
    return "normal"
  }

  const getStockBadge = (product: Product) => {
    const status = getStockStatus(product)
    const variants = {
      out: "destructive",
      low: "default",
      high: "secondary",
      normal: "secondary",
    }
    const labels = {
      out: "Agotado",
      low: "Stock Bajo",
      high: "Stock Alto",
      normal: "Normal",
    }
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold text-balance">Inventario de Productos</h2>
        <Button
          size="lg"
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="text-lg h-14 px-8"
        >
          <Plus className="mr-2 h-6 w-6" />
          Agregar Producto
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 text-lg"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="lg"
              className="text-base h-14 px-6"
            >
              {category === "all" ? "Todos" : category}
            </Button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground text-center">
              {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-balance leading-tight">{product.name}</CardTitle>
                  {getStockBadge(product)}
                </div>
                {product.description && <p className="text-base text-muted-foreground">{product.description}</p>}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Stock Actual:</span>
                    <span className="text-2xl font-bold">{product.current_stock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Precio:</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(product.unit_price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-muted-foreground">Categoría:</span>
                    <span className="text-base font-medium">{product.category}</span>
                  </div>
                  {product.expiry_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-base text-muted-foreground">Vencimiento:</span>
                      <span className="text-base font-medium flex items-center gap-1">
                        {new Date(product.expiry_date).toLocaleDateString("es-MX")}
                        {(() => {
                          const days = Math.floor(
                            (new Date(product.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                          )
                          return days <= 7 && days >= 0 ? <AlertTriangle className="h-5 w-5 text-destructive" /> : null
                        })()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 text-base h-12 bg-transparent"
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                  >
                    <Pencil className="mr-2 h-5 w-5" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1 text-base h-12"
                    onClick={() => {
                      if (confirm(`¿Eliminar ${product.name}?`)) {
                        deleteProduct(product.id)
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
