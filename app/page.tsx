import Link from "next/link"
import Encabezado from "@/componentes/encabezado"
import TarjetaDenuncia from "@/componentes/tarjeta-denuncia"
import type { Demanda } from "@/lib/tipos"

async function obtenerDenunciasDestacadas(): Promise<Demanda[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/denuncias/destacadas`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("[v0] Error al obtener denuncias destacadas:", error)
    return []
  }
}

export default async function PaginaPrincipal() {
  const denunciasDestacadas = await obtenerDenunciasDestacadas()

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0d7c66] to-[#0a5f4f] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Justicia Verde</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Plataforma ciudadana para denunciar, visibilizar y combatir delitos ambientales en Colombia
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/denuncias/crear"
              className="bg-white text-[#0d7c66] px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2"
            >
              <span>📝</span>
              Hacer una denuncia
            </Link>
            <Link
              href="/mapa"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              <span>🗺️</span>
              Ver mapa
            </Link>
          </div>
        </div>
      </section>

      {/* Denuncias Recientes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Denuncias recientes</h2>
              <p className="text-gray-600">Conoce los casos más recientes reportados por la comunidad</p>
            </div>
            <Link
              href="/denuncias"
              className="bg-[#0d7c66] text-white px-6 py-2 rounded-full hover:bg-[#0a5f4f] transition-colors"
            >
              Ver todas las denuncias
            </Link>
          </div>

          {denunciasDestacadas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {denunciasDestacadas.map((denuncia) => (
                <TarjetaDenuncia key={denuncia.id} denuncia={denuncia} mostrarAcciones={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No hay denuncias disponibles en este momento</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">¿Quieres ver todas las denuncias y participar en la comunidad?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Inicia sesión para acceder a todas las funcionalidades, comentar, seguir el progreso de los casos y
              colaborar en la protección del medio ambiente.
            </p>
            <Link
              href="/auth/login"
              className="bg-[#0d7c66] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a5f4f] transition-colors inline-block"
            >
              Iniciar sesión o registrarse
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
