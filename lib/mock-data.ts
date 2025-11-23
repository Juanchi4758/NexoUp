// Mock data for testing - will be replaced with Supabase queries
import type { Product, Customer, Sale, Alert } from "./types"

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Coca Cola 2L",
    description: "Bebida gaseosa",
    barcode: "7501055300013",
    category: "Bebidas",
    current_stock: 24,
    min_stock: 10,
    max_stock: 50,
    unit_price: 35,
    cost_price: 25,
    supplier: "Coca Cola FEMSA",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pan Blanco",
    description: "Pan de caja blanco",
    category: "Panadería",
    current_stock: 8,
    min_stock: 15,
    max_stock: 30,
    unit_price: 42,
    cost_price: 32,
    supplier: "Bimbo",
    expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Leche Entera 1L",
    description: "Leche entera pasteurizada",
    category: "Lácteos",
    current_stock: 15,
    min_stock: 12,
    max_stock: 40,
    unit_price: 28,
    cost_price: 22,
    supplier: "Alpura",
    expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "María González",
    phone: "5551234567",
    address: "Calle Principal #123",
    credit_limit: 500,
    current_debt: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Juan Pérez",
    phone: "5559876543",
    address: "Avenida Central #456",
    credit_limit: 300,
    current_debt: 280,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockSales: Sale[] = [
  {
    id: "1",
    sale_date: new Date().toISOString(),
    total_amount: 105,
    payment_method: "cash",
    status: "completed",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    sale_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    total_amount: 150,
    payment_method: "credito",
    customer_id: "1",
    customer_name: "María González",
    status: "pending",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "low_stock",
    severity: "high",
    message: "Pan Blanco tiene stock bajo (8 unidades)",
    related_id: "2",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "expiry_warning",
    severity: "medium",
    message: "Leche Entera 1L vence en 3 días",
    related_id: "3",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    type: "high_debt",
    severity: "medium",
    message: "Juan Pérez está cerca de su límite de crédito",
    related_id: "2",
    is_read: false,
    created_at: new Date().toISOString(),
  },
]
