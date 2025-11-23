"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Smartphone,
  UserCircle,
  CheckCircle,
} from "lucide-react"
import type { Sale } from "@/lib/types"

export function POSSystem() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, completeSale, customers } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<Sale["payment_method"]>("cash")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const cartTotal = cart.reduce((sum, item) => sum + item.product.unit_price * item.quantity, 0)

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío")
      return
    }

    if (paymentMethod === "credito" && !selectedCustomer) {
      alert("Selecciona un cliente para venta a crédito")
      return
    }

    // Check stock availability
    const insufficientStock = cart.find((item) => item.quantity > item.product.current_stock)
    if (insufficientStock) {
      alert(`Stock insuficiente para ${insufficientStock.product.name}`)
      return
    }

    completeSale(paymentMethod, selectedCustomer || undefined)
    setSelectedCustomer("")
    setSearchTerm("")
    alert("Venta completada exitosamente")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Product selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-16 text-lg border-2 focus:border-primary shadow-sm"
            autoFocus
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-h-[600px] overflow-y-auto pr-2">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 group"
              onClick={() => {
                if (product.current_stock > 0) {
                  addToCart(product, 1)
                } else {
                  alert("Producto agotado")
                }
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-balance leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                  {product.current_stock <= product.min_stock && (
                    <Badge variant={product.current_stock === 0 ? "destructive" : "default"} className="shadow-sm">
                      {product.current_stock === 0 ? "Agotado" : "Bajo"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-muted-foreground font-medium">Stock: {product.current_stock}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-primary">{formatPrice(product.unit_price)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping cart */}
      <div className="space-y-6">
        <Card className="border-2 shadow-xl sticky top-24">
          <CardHeader className="gradient-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <ShoppingCart className="h-7 w-7" strokeWidth={2.5} />
              Carrito de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground font-medium">Carrito vacío</p>
                <p className="text-sm text-muted-foreground">Selecciona productos para comenzar</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-4 border-2 rounded-xl shadow-sm hover:shadow-md transition-all bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base text-balance leading-tight">{item.product.name}</p>
                        <p className="text-xl text-primary font-bold">{formatPrice(item.product.unit_price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="h-10 w-10 border-2"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-xl font-bold w-12 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (item.quantity < item.product.current_stock) {
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            } else {
                              alert("Stock insuficiente")
                            }
                          }}
                          className="h-10 w-10 border-2"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-10 w-10 shadow-md"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 pt-4 space-y-4">
                  <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                    <span className="text-2xl font-bold">Total:</span>
                    <span className="text-3xl font-extrabold text-primary">{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-base font-bold">Método de Pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                        className="h-16 text-base font-semibold border-2"
                      >
                        <DollarSign className="mr-2 h-6 w-6" />
                        Efectivo
                      </Button>
                      <Button
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="h-16 text-base font-semibold border-2"
                      >
                        <CreditCard className="mr-2 h-6 w-6" />
                        Tarjeta
                      </Button>
                      <Button
                        variant={paymentMethod === "transfer" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("transfer")}
                        className="h-16 text-base font-semibold border-2"
                      >
                        <Smartphone className="mr-2 h-6 w-6" />
                        Transferencia
                      </Button>
                      <Button
                        variant={paymentMethod === "credito" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("credito")}
                        className="h-16 text-base font-semibold border-2"
                      >
                        <UserCircle className="mr-2 h-6 w-6" />
                        Crédito
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "credito" && (
                    <div className="space-y-2">
                      <label className="text-base font-bold">Cliente</label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger className="h-14 text-lg border-2">
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id} className="text-lg py-3">
                              {customer.name} - Deuda: {formatPrice(customer.current_debt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full h-16 text-xl font-extrabold shadow-lg gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={handleCompleteSale}
                  >
                    <CheckCircle className="mr-2 h-7 w-7" />
                    Completar Venta
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
