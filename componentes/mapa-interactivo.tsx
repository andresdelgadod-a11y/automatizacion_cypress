"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { Demanda } from "@/lib/tipos"

// Importar Leaflet dinámicamente para evitar problemas con SSR
const MapaContenido = dynamic(() => import("./mapa-contenido"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
})

export default function MapaInteractivo() {
  const [denuncias, setDenuncias] = useState<Demanda[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDenuncias() {
      try {
        const res = await fetch("/api/denuncias/mapa")
        if (res.ok) {
          const data = await res.json()
          setDenuncias(data)
        }
      } catch (error) {
        console.error("[v0] Error al cargar denuncias para mapa:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDenuncias()
  }, [])

  if (cargando) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando denuncias...</p>
      </div>
    )
  }

  return <MapaContenido denuncias={denuncias} />
}
