import { AlertsPanel } from "@/components/alerts/alerts-panel"

export const metadata = {
  title: "Alertas - NEXOVENTIS",
  description: "Centro de notificaciones y alertas",
}

export default function AlertsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Centro de Alertas
        </h1>
        <p className="text-xl text-slate-300">Notificaciones y alertas importantes</p>
      </div>
      <AlertsPanel />
    </div>
  )
}
