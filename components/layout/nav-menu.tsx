"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, Package, Users, Bell, Zap } from "lucide-react"
import { AlertsBadge } from "../alerts/alerts-badge"
import { UserMenu } from "../auth/user-menu"

export function NavMenu() {
  const pathname = usePathname()

  const navItems = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Ventas", href: "/sales", icon: ShoppingCart },
    { label: "Inventario", href: "/inventory", icon: Package },
    { label: "Clientes", href: "/customers", icon: Users },
    { label: "Alertas", href: "/alerts", icon: Bell, badge: true },
  ]

  return (
    <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Zap className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                NEXOVENTIS
              </h1>
              <p className="text-sm text-slate-400 font-medium">Gestión Inteligente</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className={`h-14 px-4 lg:px-6 text-base font-medium relative transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <div className="relative">
                      <Icon className="h-6 w-6 lg:mr-2" strokeWidth={2} />
                      {item.badge && !isActive && (
                        <div className="absolute -top-2 -right-2">
                          <AlertsBadge />
                        </div>
                      )}
                    </div>
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
            <div className="ml-2 pl-2 border-l border-slate-800">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
