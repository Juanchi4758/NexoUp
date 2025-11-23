import { ProductList } from "@/components/inventory/product-list"

export const metadata = {
  title: "Inventario - NEXOVENTIS",
  description: "Gestión de inventario para La Vecina",
}

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Gestión de Inventario
        </h1>
        <p className="text-xl text-slate-300">Controla tu stock y productos</p>
      </div>
      <ProductList />
    </div>
  )
}
