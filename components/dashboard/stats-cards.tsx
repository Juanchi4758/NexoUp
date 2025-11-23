"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Package, TrendingUp, AlertTriangle, Wallet, Bell } from "lucide-react"

export function StatsCards() {
  const { sales, products, customers, alerts } = useStore()

  // Calculate today's sales
  const today = new Date().toDateString()
  const todaySales = sales.filter((s) => new Date(s.sale_date).toDateString() === today)
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total_amount, 0)

  // Calculate this month's revenue
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthSales = sales.filter((s) => {
    const saleDate = new Date(s.sale_date)
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
  })
  const monthRevenue = monthSales.reduce((sum, s) => sum + s.total_amount, 0)

  // Low stock products
  const lowStockProducts = products.filter((p) => p.current_stock <= p.min_stock)

  // Total debt
  const totalDebt = customers.reduce((sum, c) => sum + c.current_debt, 0)

  // Unread alerts
  const unreadAlerts = alerts.filter((a) => !a.is_read).length

  // Total inventory value
  const inventoryValue = products.reduce((sum, p) => sum + p.current_stock * p.cost_price, 0)

  const stats = [
    {
      title: "Ventas Hoy",
      value: formatPrice(todayRevenue),
      subtitle: `${todaySales.length} transacciones`,
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      glowColor: "shadow-emerald-500/20",
    },
    {
      title: "Ventas del Mes",
      value: formatPrice(monthRevenue),
      subtitle: `${monthSales.length} transacciones`,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      glowColor: "shadow-blue-500/20",
    },
    {
      title: "Valor Inventario",
      value: formatPrice(inventoryValue),
      subtitle: `${products.length} productos`,
      icon: Package,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      glowColor: "shadow-cyan-500/20",
    },
    {
      title: "Deuda Total",
      value: formatPrice(totalDebt),
      subtitle: `${customers.length} clientes`,
      icon: Wallet,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      glowColor: "shadow-amber-500/20",
    },
    {
      title: "Stock Bajo",
      value: lowStockProducts.length.toString(),
      subtitle: "productos afectados",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      glowColor: "shadow-red-500/20",
    },
    {
      title: "Alertas Pendientes",
      value: unreadAlerts.toString(),
      subtitle: "requieren atención",
      icon: Bell,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      glowColor: "shadow-orange-500/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-slate-300">{stat.title}</CardTitle>
              <div
                className={`${stat.bgColor} p-3 rounded-xl shadow-lg ${stat.glowColor} group-hover:scale-110 transition-all duration-300`}
              >
                <Icon className={`h-6 w-6 ${stat.color}`} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 font-medium">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
