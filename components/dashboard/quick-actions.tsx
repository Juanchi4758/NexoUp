"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, Users, Bell, ArrowRight } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Nueva Venta",
      description: "Registrar una venta",
      icon: ShoppingCart,
      href: "/sales",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Gestionar Inventario",
      description: "Ver y actualizar productos",
      icon: Package,
      href: "/inventory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Ver Clientes",
      description: "Gestionar créditos y pagos",
      icon: Users,
      href: "/customers",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Ver Alertas",
      description: "Revisar notificaciones",
      icon: Bell,
      href: "/alerts",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto py-5 flex items-center justify-between gap-4 bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:translate-x-1 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`${action.bgColor} p-4 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-7 w-7 ${action.color}`} strokeWidth={2.5} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">{action.title}</p>
                      <p className="text-sm text-slate-400 font-medium">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
