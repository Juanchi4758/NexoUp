"use client"

import type { User, LoginCredentials, RegisterData } from "./types"
import { supabase } from "./supabase"

// Mock users storage for fallback when Supabase is not configured
const STORAGE_KEY = "nexoventis_users"
const SESSION_KEY = "nexoventis_session"

// Simple password hashing for mock mode
const hashPassword = (password: string): string => {
  return btoa(password + "salt_nexoventis_2024")
}

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}

// Get all users from localStorage (fallback mode)
export const getAllUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save users to localStorage (fallback mode)
const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// Register new user
export const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string; user?: User }> => {
  if (!supabase) {
    // Fallback to localStorage
    const users = getAllUsers()

    if (users.some((u) => u.email === data.email)) {
      return { success: false, error: "El correo electrónico ya está registrado" }
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email: data.email,
      full_name: data.full_name,
      role: data.role || "employee",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const passwordKey = `nexoventis_pwd_${newUser.id}`
    localStorage.setItem(passwordKey, hashPassword(data.password))

    users.push(newUser)
    saveUsers(users)

    return { success: true, user: newUser }
  }

  // Use Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        role: data.role || "employee",
      },
    },
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: "Error al crear el usuario" }
  }

  // Insert user data into users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role || "employee",
        is_active: true,
      },
    ])
    .select()
    .single()

  if (userError) {
    console.error("[v0] Error inserting user data:", userError)
    return { success: false, error: "Error al crear el perfil de usuario" }
  }

  return { success: true, user: userData }
}

// Login user
export const loginUser = async (
  credentials: LoginCredentials,
): Promise<{ success: boolean; error?: string; user?: User }> => {
  if (!supabase) {
    // Fallback to localStorage
    const users = getAllUsers()
    const user = users.find((u) => u.email === credentials.email)

    if (!user) {
      return { success: false, error: "Correo o contraseña incorrectos" }
    }

    if (!user.is_active) {
      return { success: false, error: "Usuario inactivo. Contacte al administrador" }
    }

    const passwordKey = `nexoventis_pwd_${user.id}`
    const storedHash = localStorage.getItem(passwordKey)

    if (!storedHash || !verifyPassword(credentials.password, storedHash)) {
      return { success: false, error: "Correo o contraseña incorrectos" }
    }

    const session = {
      user,
      token: Math.random().toString(36).substring(7),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    return { success: true, user }
  }

  // Use Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (authError) {
    return { success: false, error: "Correo o contraseña incorrectos" }
  }

  if (!authData.user) {
    return { success: false, error: "Error al iniciar sesión" }
  }

  // Get user data from users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single()

  if (userError || !userData) {
    console.error("[v0] Error fetching user data:", userError)
    return { success: false, error: "Error al obtener datos del usuario" }
  }

  if (!userData.is_active) {
    await supabase.auth.signOut()
    return { success: false, error: "Usuario inactivo. Contacte al administrador" }
  }

  return { success: true, user: userData }
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  if (!supabase) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY)
    }
    return
  }

  await supabase.auth.signOut()
}

// Get current session
export const getCurrentSession = async (): Promise<{ user: User; token: string; expiresAt: string } | null> => {
  if (!supabase) {
    // Fallback to localStorage
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    const session = JSON.parse(stored)

    if (new Date(session.expiresAt) < new Date()) {
      logoutUser()
      return null
    }

    return session
  }

  // Use Supabase Auth
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  // Get user data from users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData) {
    return null
  }

  return {
    user: userData,
    token: session.access_token,
    expiresAt: new Date(session.expires_at! * 1000).toISOString(),
  }
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession()
  return session !== null
}

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getCurrentSession()
  return session ? session.user : null
}

// Initialize with default admin user if no users exist
export const initializeAuth = (): void => {
  if (supabase) {
    // In Supabase mode, admin user should be created via SQL scripts
    return
  }

  // Fallback mode: create default admin in localStorage
  const users = getAllUsers()
  if (users.length === 0) {
    const adminUser: User = {
      id: "admin_default",
      email: "admin@nexoventis.com",
      full_name: "Administrador",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    localStorage.setItem(`nexoventis_pwd_${adminUser.id}`, hashPassword("admin123"))
    saveUsers([adminUser])
  }
}
