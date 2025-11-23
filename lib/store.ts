"use client"

import { create } from "zustand"
import type { Product, Customer, Sale, Alert } from "./types"
import { mockProducts, mockCustomers, mockSales, mockAlerts } from "./mock-data"
import { supabase } from "./supabase"

interface CartItem {
  product: Product
  quantity: number
}

interface AppStore {
  // Products
  products: Product[]
  loadProducts: () => Promise<void>
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateStock: (productId: string, quantity: number) => Promise<void>

  // Customers
  customers: Customer[]
  loadCustomers: () => Promise<void>
  addCustomer: (customer: Omit<Customer, "id" | "created_at" | "updated_at">) => Promise<void>
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>

  // Sales & Cart
  cart: CartItem[]
  sales: Sale[]
  loadSales: () => Promise<void>
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  completeSale: (paymentMethod: string, customerId?: string) => Promise<void>

  // Credito payment tracking
  addCreditoPayment: (customerId: string, amount: number, paymentMethod: "cash" | "card" | "transfer") => Promise<void>

  // Alerts
  alerts: Alert[]
  loadAlerts: () => Promise<void>
  markAlertAsRead: (id: string) => Promise<void>
  checkAndGenerateAlerts: () => Promise<void>
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial data
  products: mockProducts,
  customers: mockCustomers,
  sales: mockSales,
  alerts: mockAlerts,
  cart: [],

  // Products
  loadProducts: async () => {
    if (!supabase) return

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      set({ products: data })
    }
  },

  addProduct: async (product) => {
    if (!supabase) {
      // Fallback to mock
      const newProduct: Product = {
        ...product,
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set((state) => ({ products: [...state.products, newProduct] }))
      get().checkAndGenerateAlerts()
      return
    }

    const { data, error } = await supabase.from("products").insert([product]).select().single()

    if (!error && data) {
      set((state) => ({ products: [data, ...state.products] }))
      get().checkAndGenerateAlerts()
    }
  },

  updateProduct: async (id, updates) => {
    if (!supabase) {
      // Fallback to mock
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p,
        ),
      }))
      get().checkAndGenerateAlerts()
      return
    }

    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

    if (!error && data) {
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? data : p)),
      }))
      get().checkAndGenerateAlerts()
    }
  },

  deleteProduct: async (id) => {
    if (!supabase) {
      // Fallback to mock
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
      return
    }

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (!error) {
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
    }
  },

  updateStock: async (productId, quantity) => {
    const product = get().products.find((p) => p.id === productId)
    if (!product) return

    await get().updateProduct(productId, {
      current_stock: product.current_stock + quantity,
    })
  },

  // Customers
  loadCustomers: async () => {
    if (!supabase) return

    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      set({ customers: data })
    }
  },

  addCustomer: async (customer) => {
    if (!supabase) {
      // Fallback to mock
      const newCustomer: Customer = {
        ...customer,
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set((state) => ({ customers: [...state.customers, newCustomer] }))
      return
    }

    const { data, error } = await supabase.from("customers").insert([customer]).select().single()

    if (!error && data) {
      set((state) => ({ customers: [data, ...state.customers] }))
    }
  },

  updateCustomer: async (id, updates) => {
    if (!supabase) {
      // Fallback to mock
      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c,
        ),
      }))
      get().checkAndGenerateAlerts()
      return
    }

    const { data, error } = await supabase.from("customers").update(updates).eq("id", id).select().single()

    if (!error && data) {
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? data : c)),
      }))
      get().checkAndGenerateAlerts()
    }
  },

  // Sales
  loadSales: async () => {
    if (!supabase) return

    const { data, error } = await supabase.from("sales").select("*").order("sale_date", { ascending: false })

    if (!error && data) {
      set({ sales: data })
    }
  },

  // Cart
  addToCart: (product, quantity) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      }
      return { cart: [...state.cart, { product, quantity }] }
    })
  },

  removeFromCart: (productId) => {
    set((state) => ({ cart: state.cart.filter((item) => item.product.id !== productId) }))
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set((state) => ({
      cart: state.cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    }))
  },

  clearCart: () => {
    set({ cart: [] })
  },

  completeSale: async (paymentMethod, customerId) => {
    const { cart, products, customers } = get()

    if (cart.length === 0) return

    const total = cart.reduce((sum, item) => sum + item.product.unit_price * item.quantity, 0)
    const customer = customerId ? customers.find((c) => c.id === customerId) : undefined

    const saleData = {
      sale_date: new Date().toISOString(),
      total_amount: total,
      payment_method: paymentMethod,
      customer_id: customerId || null,
      customer_name: customer?.name || null,
      status: paymentMethod === "credito" ? "pending" : "completed",
    }

    if (!supabase) {
      // Fallback to mock
      const newSale: Sale = {
        ...saleData,
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
      }

      // Update stock
      for (const item of cart) {
        await get().updateStock(item.product.id, -item.quantity)
      }

      if (paymentMethod === "credito" && customer) {
        await get().updateCustomer(customer.id, {
          current_debt: customer.current_debt + total,
        })
      }

      set((state) => ({ sales: [newSale, ...state.sales] }))
      get().clearCart()
      get().checkAndGenerateAlerts()
      return
    }

    // Insert sale
    const { data: sale, error } = await supabase.from("sales").insert([saleData]).select().single()

    if (error || !sale) {
      console.error("[v0] Error creating sale:", error)
      return
    }

    // Update stock
    for (const item of cart) {
      await get().updateStock(item.product.id, -item.quantity)
    }

    if (paymentMethod === "credito" && customer) {
      await get().updateCustomer(customer.id, {
        current_debt: customer.current_debt + total,
      })
    }

    set((state) => ({ sales: [sale, ...state.sales] }))
    get().clearCart()
    get().checkAndGenerateAlerts()
  },

  // Credito payment tracking
  addCreditoPayment: async (customerId, amount, paymentMethod) => {
    const customer = get().customers.find((c) => c.id === customerId)
    if (!customer) return

    const newDebt = Math.max(0, customer.current_debt - amount)
    await get().updateCustomer(customerId, { current_debt: newDebt })
    await get().checkAndGenerateAlerts()
  },

  // Alerts
  loadAlerts: async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (!error && data) {
      set({ alerts: data })
    }
  },

  markAlertAsRead: async (id) => {
    if (!supabase) {
      // Fallback to mock
      set((state) => ({
        alerts: state.alerts.map((a) => (a.id === id ? { ...a, is_read: true } : a)),
      }))
      return
    }

    const { error } = await supabase.from("alerts").update({ is_read: true }).eq("id", id)

    if (!error) {
      set((state) => ({
        alerts: state.alerts.map((a) => (a.id === id ? { ...a, is_read: true } : a)),
      }))
    }
  },

  checkAndGenerateAlerts: async () => {
    const { products, customers } = get()
    const newAlerts: Omit<Alert, "id" | "created_at">[] = []

    // Check low stock
    products.forEach((product) => {
      if (product.current_stock <= product.min_stock) {
        newAlerts.push({
          type: "low_stock",
          severity: product.current_stock === 0 ? "high" : "medium",
          message: `${product.name} tiene stock ${product.current_stock === 0 ? "agotado" : `bajo (${product.current_stock} unidades)`}`,
          related_id: product.id,
          is_read: false,
        })
      }
    })

    // Check expiry dates
    products.forEach((product) => {
      if (product.expiry_date) {
        const daysUntilExpiry = Math.floor(
          (new Date(product.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        )
        if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
          newAlerts.push({
            type: "expiry_warning",
            severity: daysUntilExpiry <= 3 ? "high" : "medium",
            message: `${product.name} vence en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? "s" : ""}`,
            related_id: product.id,
            is_read: false,
          })
        }
      }
    })

    // Check customer debt
    customers.forEach((customer) => {
      if (customer.current_debt >= customer.credit_limit * 0.8) {
        newAlerts.push({
          type: "high_debt",
          severity: customer.current_debt >= customer.credit_limit ? "high" : "medium",
          message: `${customer.name} ${customer.current_debt >= customer.credit_limit ? "alcanzó" : "está cerca de"} su límite de crédito`,
          related_id: customer.id,
          is_read: false,
        })
      }
    })

    if (!supabase) {
      // Fallback to mock
      set((state) => {
        const existingMessages = new Set(state.alerts.map((a) => a.message))
        const uniqueNewAlerts = newAlerts
          .map((a, i) => ({
            ...a,
            id: `alert-${Date.now()}-${i}`,
            created_at: new Date().toISOString(),
          }))
          .filter((a) => !existingMessages.has(a.message))
        return { alerts: [...uniqueNewAlerts, ...state.alerts].slice(0, 50) }
      })
      return
    }

    // Insert new alerts to database
    if (newAlerts.length > 0) {
      const { data, error } = await supabase.from("alerts").insert(newAlerts).select()

      if (!error && data) {
        await get().loadAlerts()
      }
    }
  },
}))
