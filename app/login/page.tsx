import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/50">
            <div className="text-4xl font-black text-white">N</div>
          </div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NEXOVENTIS
          </h1>
          <p className="text-xl text-slate-300">Sistema de Gestión Empresarial</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
