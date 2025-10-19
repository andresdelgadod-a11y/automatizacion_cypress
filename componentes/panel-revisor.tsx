"use client"

import { useEffect, useState } from "react"
import type { Demanda, EstadisticasRevisor } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"

interface PanelRevisorProps {
  revisorId: number
}

export default function PanelRevisor({ revisorId }: PanelRevisorProps) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasRevisor | null>(null)
  const [denunciasDisponibles, setDenunciasDisponibles] = useState<Demanda[]>([])
  const [denunciasEnProceso, setDenunciasEnProceso] = useState<Demanda[]>([])
  const [denunciasResueltas, setDenunciasResueltas] = useState<Demanda[]>([])
  const [vistaActual, setVistaActual] = useState<"disponibles" | "en_proceso" | "resueltas">("disponibles")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [revisorId])

  async function cargarDatos() {
    try {
      // Cargar estadísticas
      const resEstadisticas = await fetch(`/api/estadisticas/revisor/${revisorId}`)
      if (resEstadisticas.ok) {
        const dataEstadisticas = await resEstadisticas.json()
        setEstadisticas(dataEstadisticas)
      }

      // Cargar todas las denuncias
      const resDenuncias = await fetch("/api/denuncias")
      if (resDenuncias.ok) {
        const todasDenuncias: Demanda[] = await resDenuncias.json()

        // Filtrar denuncias disponibles (no asignadas a este revisor)
        const disponibles = todasDenuncias.filter(
          (d) => d.estado === "en_revision" && (!d.revisores || !d.revisores.some((r) => r.id === revisorId)),
        )
        setDenunciasDisponibles(disponibles)

        // Filtrar denuncias en proceso (asignadas a este revisor)
        const enProceso = todasDenuncias.filter(
          (d) => d.estado === "en_revision" && d.revisores && d.revisores.some((r) => r.id === revisorId),
        )
        setDenunciasEnProceso(enProceso)

        // Filtrar denuncias resueltas (asignadas a este revisor)
        const resueltas = todasDenuncias.filter(
          (d) => d.estado === "tomaron_el_caso" && d.revisores && d.revisores.some((r) => r.id === revisorId),
        )
        setDenunciasResueltas(resueltas)
      }
    } catch (error) {
      console.error("[v0] Error al cargar datos del revisor:", error)
    } finally {
      setCargando(false)
    }
  }

  async function tomarCaso(denunciaId: number) {
    try {
      const res = await fetch(`/api/denuncias/${denunciaId}/asignar-revisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisor_id: revisorId }),
      })

      if (res.ok) {
        alert("Caso tomado exitosamente")
        cargarDatos() // Recargar datos
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Error al tomar caso:", error)
      alert("Error al tomar el caso")
    }
  }

  if (cargando) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  const denunciasActuales =
    vistaActual === "disponibles"
      ? denunciasDisponibles
      : vistaActual === "en_proceso"
        ? denunciasEnProceso
        : denunciasResueltas

  return (
    <div>
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h1 className="text-2xl font-bold">Dr. Carlos Mendoza</h1>
            <p className="text-gray-600">Grupo VerdeLex</p>
            <p className="text-sm text-gray-500">Derecho Ambiental</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>⏱️</span>
            <span>8 en revisión</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>45 resueltas</span>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">{estadisticas.disponibles}</div>
            <div className="text-gray-700 font-medium">Disponibles</div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{estadisticas.en_proceso}</div>
            <div className="text-gray-700 font-medium">En proceso</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="text-4xl font-bold text-green-600 mb-2">{estadisticas.resueltas}</div>
            <div className="text-gray-700 font-medium">Resueltas</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <div className="text-4xl font-bold text-purple-600 mb-2">{estadisticas.total_casos}</div>
            <div className="text-gray-700 font-medium">Total casos</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setVistaActual("disponibles")}
          className={`px-6 py-3 font-medium transition-colors ${
            vistaActual === "disponibles"
              ? "border-b-2 border-[#0d7c66] text-[#0d7c66]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Disponibles ({estadisticas?.disponibles || 0})
        </button>
        <button
          onClick={() => setVistaActual("en_proceso")}
          className={`px-6 py-3 font-medium transition-colors ${
            vistaActual === "en_proceso"
              ? "border-b-2 border-[#0d7c66] text-[#0d7c66]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          En proceso ({estadisticas?.en_proceso || 0})
        </button>
        <button
          onClick={() => setVistaActual("resueltas")}
          className={`px-6 py-3 font-medium transition-colors ${
            vistaActual === "resueltas"
              ? "border-b-2 border-[#0d7c66] text-[#0d7c66]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Resueltas ({estadisticas?.resueltas || 0})
        </button>
      </div>

      {/* Lista de denuncias */}
      <div className="space-y-4">
        {denunciasActuales.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No hay denuncias en esta categoría</p>
          </div>
        ) : (
          denunciasActuales.map((denuncia) => (
            <div key={denuncia.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorPrioridad(denuncia.prioridad)}`}
                    >
                      {obtenerTextoPrioridad(denuncia.prioridad)}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {denuncia.tipo_demanda_nombre}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{denuncia.titulo}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{denuncia.descripcion}</p>

                  {denuncia.ubicacion_texto && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span>📍</span>
                      <span>{denuncia.ubicacion_texto}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>❤️ 456 likes</span>
                    <span>💬 1 comentarios</span>
                    <span>👁️ 2341 vistas</span>
                  </div>

                  <div className="text-sm text-gray-400">📅 {formatearFechaCorta(denuncia.creado_en)}</div>
                </div>

                <div className="flex flex-col gap-2">
                  {vistaActual === "disponibles" && (
                    <button
                      onClick={() => tomarCaso(denuncia.id)}
                      className="px-4 py-2 bg-[#0d7c66] text-white rounded-lg hover:bg-[#0a5f4f] transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                      <span>✋</span>
                      Tomar caso
                    </button>
                  )}
                  <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2">
                    <span>👁️</span>
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
