"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllUsers, getCurrentUser } from "@/lib/auth"
import { User, UserPlus, Shield, UserCircle, AlertCircle } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserType[]>([])
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)

      if (supabase) {
        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        if (!error && data) {
          setUsers(data)
        }
      } else {
        setUsers(getAllUsers())
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const isAdmin = currentUser?.role === "admin"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <User className="h-12 w-12 text-blue-400" />
            Gestión de Usuarios
          </h1>
          <p className="text-xl text-slate-300">Administra los usuarios del sistema NEXOVENTIS</p>
        </div>
        {isAdmin && (
          <Button
            size="lg"
            className="h-14 text-lg px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 font-semibold"
            onClick={() => router.push("/register")}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {!isAdmin && (
        <Alert className="border-orange-600 bg-orange-950/30 backdrop-blur-xl">
          <AlertCircle className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-200 text-base">
            Solo los administradores pueden crear nuevos usuarios. Contacta a un administrador si necesitas crear una
            cuenta.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user.id}
            className={`bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 ${
              currentUser?.id === user.id ? "border-blue-500 shadow-lg shadow-blue-500/20" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {user.role === "admin" ? (
                    <Shield className="h-8 w-8 text-blue-400" />
                  ) : (
                    <UserCircle className="h-8 w-8 text-slate-400" />
                  )}
                  <div>
                    <CardTitle className="text-xl text-white">{user.full_name}</CardTitle>
                    <CardDescription className="text-base text-slate-400">{user.email}</CardDescription>
                  </div>
                </div>
                {currentUser?.id === user.id && (
                  <Badge variant="secondary" className="text-sm bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Tú
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base text-slate-400">Rol:</span>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={`text-sm ${
                    user.role === "admin"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {user.role === "admin" ? "Administrador" : "Empleado"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base text-slate-400">Estado:</span>
                <Badge
                  variant={user.is_active ? "default" : "destructive"}
                  className={user.is_active ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : ""}
                >
                  {user.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="text-sm text-slate-500 pt-2 border-t border-slate-800">
                Registrado: {new Date(user.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-slate-600 mb-4" />
            <p className="text-xl text-slate-400 mb-6">No hay usuarios registrados</p>
            {isAdmin && (
              <Button
                size="lg"
                className="h-14 text-lg px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 font-semibold"
                onClick={() => router.push("/register")}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Primer Usuario
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
