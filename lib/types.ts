// Core types for NEXOVENTIS system

export interface Product {
  id: string
  name: string
  description?: string
  barcode?: string
  category: string
  current_stock: number
  min_stock: number
  max_stock: number
  unit_price: number
  cost_price: number
  supplier?: string
  expiry_date?: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  sale_date: string
  total_amount: number
  payment_method: "cash" | "card" | "transfer" | "credito"
  customer_id?: string
  customer_name?: string
  status: "completed" | "pending" | "cancelled"
  notes?: string
  created_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  credit_limit: number
  current_debt: number
  created_at: string
  updated_at: string
}

export interface CreditoAccount {
  id: string
  customer_id: string
  customer_name: string
  total_debt: number
  last_purchase_date: string
  payment_history: CreditoPayment[]
  purchases: Sale[]
}

export interface CreditoPayment {
  id: string
  customer_id: string
  amount: number
  payment_date: string
  payment_method: "cash" | "card" | "transfer"
  notes?: string
}

export interface StockMovement {
  id: string
  product_id: string
  product_name: string
  movement_type: "entry" | "exit" | "adjustment" | "sale"
  quantity: number
  reason: string
  date: string
  user_id?: string
}

export interface Alert {
  id: string
  type: "low_stock" | "expiry_warning" | "high_debt" | "system"
  severity: "low" | "medium" | "high"
  message: string
  related_id?: string
  is_read: boolean
  created_at: string
}

export interface DailySummary {
  date: string
  total_sales: number
  total_transactions: number
  cash_sales: number
  card_sales: number
  credito_sales: number
  top_products: Array<{ product_name: string; quantity: number; revenue: number }>
}

export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "employee"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  role?: "admin" | "employee"
}
