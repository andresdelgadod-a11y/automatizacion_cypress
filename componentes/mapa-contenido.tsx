"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import type { Demanda } from "@/lib/tipos"
import { obtenerColorPrioridad, obtenerTextoPrioridad, formatearFechaCorta } from "@/lib/utilidades"
import "leaflet/dist/leaflet.css"

// Configurar iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface MapaContenidoProps {
  denuncias: Demanda[]
}

// Función para crear iconos personalizados según prioridad
function crearIconoPrioridad(prioridad: string) {
  let color = "#eab308" // amarillo por defecto (medio)
  if (prioridad === "critica") color = "#ef4444" // rojo
  if (prioridad === "alta") color = "#f97316" // naranja

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  })
}

export default function MapaContenido({ denuncias }: MapaContenidoProps) {
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState<Demanda | null>(null)

  // Centro de Colombia
  const centroMapa: [number, number] = [4.5709, -74.2973]

  return (
    <div className="relative w-full h-full">
      <MapContainer center={centroMapa} zoom={6} className="w-full h-full" style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {denuncias.map((denuncia) => {
          if (!denuncia.latitud || !denuncia.longitud) return null

          return (
            <Marker
              key={denuncia.id}
              position={[denuncia.latitud, denuncia.longitud]}
              icon={crearIconoPrioridad(denuncia.prioridad)}
              eventHandlers={{
                click: () => setDenunciaSeleccionada(denuncia),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{denuncia.titulo}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{denuncia.descripcion}</p>
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${obtenerColorPrioridad(denuncia.prioridad)}`}>
                      {obtenerTextoPrioridad(denuncia.prioridad)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{denuncia.ubicacion_texto}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Panel lateral con detalles de denuncia seleccionada */}
      {denunciaSeleccionada && (
        <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-xl z-[1000] max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold pr-8 text-balance">{denunciaSeleccionada.titulo}</h2>
              <button
                onClick={() => setDenunciaSeleccionada(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${obtenerColorPrioridad(denunciaSeleccionada.prioridad)}`}
              >
                {obtenerTextoPrioridad(denunciaSeleccionada.prioridad)}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {denunciaSeleccionada.tipo_demanda_nombre}
              </span>
              {denunciaSeleccionada.estado === "tomaron_el_caso" && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                  Recibida
                </span>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{denunciaSeleccionada.descripcion}</p>
            </div>

            {denunciaSeleccionada.ubicacion_texto && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-sm text-gray-700">{denunciaSeleccionada.ubicacion_texto}</p>
              </div>
            )}

            {(denunciaSeleccionada as any).foto_principal && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Evidencias</h3>
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={(denunciaSeleccionada as any).foto_principal || "/placeholder.svg"}
                    alt="Evidencia"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 py-3 border-t">
              <span>❤️ 456</span>
              <span>💬 1</span>
              <span>🔗 89</span>
            </div>

            <div className="text-xs text-gray-400 pt-2 border-t">
              👁️ 2341 vistas • {formatearFechaCorta(denunciaSeleccionada.creado_en)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
