"use client"

import { useState } from "react"
import { POSSystem } from "@/components/sales/pos-system"
import { SalesHistory } from "@/components/sales/sales-history"
import { Button } from "@/components/ui/button"
import { ShoppingCart, History } from "lucide-react"

export default function SalesPage() {
  const [view, setView] = useState<"pos" | "history">("pos")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Sistema de Ventas
        </h1>
        <div className="flex gap-3">
          <Button
            size="lg"
            variant={view === "pos" ? "default" : "outline"}
            onClick={() => setView("pos")}
            className={`text-lg h-14 px-6 font-semibold transition-all duration-200 ${
              view === "pos"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white"
                : "border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Nueva Venta
          </Button>
          <Button
            size="lg"
            variant={view === "history" ? "default" : "outline"}
            onClick={() => setView("history")}
            className={`text-lg h-14 px-6 font-semibold transition-all duration-200 ${
              view === "history"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 text-white"
                : "border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <History className="mr-2 h-6 w-6" />
            Historial
          </Button>
        </div>
      </div>

      {view === "pos" ? <POSSystem /> : <SalesHistory />}
    </div>
  )
}
