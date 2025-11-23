import { CustomerList } from "@/components/customers/customer-list"

export const metadata = {
  title: "Clientes y Créditos - NEXOVENTIS",
  description: "Gestión de clientes y cuentas de crédito",
}

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Gestión de Clientes
        </h1>
        <p className="text-xl text-slate-300">Administra clientes y cuentas de crédito</p>
      </div>
      <CustomerList />
    </div>
  )
}
