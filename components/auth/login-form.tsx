"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginUser } from "@/lib/auth"
import { Eye, EyeOff, LogIn } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Por favor complete todos los campos")
      setLoading(false)
      return
    }

    const result = await loginUser({ email, password })

    if (result.success) {
      router.push("/")
      router.refresh()
    } else {
      setError(result.error || "Error al iniciar sesión")
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-lg border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold text-center text-white">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center text-lg text-slate-300">
          Accede a tu panel de gestión empresarial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-900 bg-red-950/50">
              <AlertDescription className="text-base text-red-200">{error}</AlertDescription>
            </Alert>
          )}

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

          <Button
            type="submit"
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30"
            disabled={loading}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-6">
        <div className="text-sm text-center text-slate-400 pt-4 border-t border-slate-800 w-full space-y-1">
          <p className="font-semibold text-slate-300">Credenciales de Administrador:</p>
          <p className="font-mono">admin@nexoventis.com</p>
          <p className="font-mono">admin123</p>
          <p className="text-xs text-slate-500 mt-2">Solo el administrador puede crear nuevos usuarios</p>
        </div>
      </CardFooter>
    </Card>
  )
}
