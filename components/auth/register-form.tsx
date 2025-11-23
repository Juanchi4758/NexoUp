"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "@/lib/auth"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"admin" | "employee">("employee")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError("Por favor complete todos los campos")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    const result = await registerUser({ email, password, full_name: fullName, role })

    if (result.success) {
      alert("Usuario registrado exitosamente")
      router.push("/users")
    } else {
      setError(result.error || "Error al registrar usuario")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold text-center text-white">Crear Nuevo Usuario</CardTitle>
        <CardDescription className="text-center text-lg text-slate-300">
          Registra un nuevo usuario en el sistema NEXOVENTIS
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="border-red-900 bg-red-950/50">
              <AlertDescription className="text-base text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-lg text-slate-200">
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-14 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg text-slate-200">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-lg text-slate-200">
              Rol del Usuario
            </Label>
            <Select value={role} onValueChange={(value: "admin" | "employee") => setRole(value)} disabled={loading}>
              <SelectTrigger className="h-14 text-lg bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="employee" className="text-lg text-white focus:bg-slate-700">
                  Empleado
                </SelectItem>
                <SelectItem value="admin" className="text-lg text-white focus:bg-slate-700">
                  Administrador
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg text-slate-200">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-700 text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-lg text-slate-200">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 text-lg pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-700 text-slate-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30"
            disabled={loading}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {loading ? "Creando Usuario..." : "Crear Usuario"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-6">
        <Button
          variant="ghost"
          className="w-full text-base text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => router.push("/users")}
        >
          Volver a Usuarios
        </Button>
      </CardFooter>
    </Card>
  )
}
