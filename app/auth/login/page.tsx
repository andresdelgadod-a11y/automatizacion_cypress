"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PaginaLogin() {
  const router = useRouter()
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      })

      if (res.ok) {
        const data = await res.json()
        // TODO: Guardar sesión
        alert(`Bienvenido ${data.usuario.nombre_completo}`)

        // Redirigir según el rol
        if (data.usuario.rol_nombre === "admin") {
          router.push("/admin/panel")
        } else if (data.usuario.rol_nombre === "revisor") {
          router.push("/revisor/panel")
        } else {
          router.push("/ciudadano/panel")
        }
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Error en login:", error)
      alert("Error al iniciar sesión")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d7c66] to-[#0a5f4f] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0d7c66] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Justicia Verde</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={manejarLogin} className="space-y-6">
          <div>
            <label htmlFor="correo" className="block text-sm font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7c66] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#0d7c66] text-white py-3 rounded-lg font-semibold hover:bg-[#0a5f4f] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/registro" className="text-[#0d7c66] font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 font-semibold mb-2">Usuarios de prueba:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>Admin: admin@gmail.com / admin123</li>
            <li>Ciudadano: ciudadano@gmail.com / ciudadano123</li>
            <li>Revisor: revisor@gmail.com / revisor123</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-[#0d7c66]">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
