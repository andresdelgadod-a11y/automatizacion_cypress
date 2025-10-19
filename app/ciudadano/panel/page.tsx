import Encabezado from "@/componentes/encabezado"
import PanelCiudadano from "@/componentes/panel-ciudadano"

export default function PaginaPanelCiudadano() {
  // TODO: Obtener usuario autenticado
  const usuarioId = 2 // Simulado

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado
        usuarioActual={{
          nombre: "Carlos Pérez",
          rol: "ciudadano",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <PanelCiudadano usuarioId={usuarioId} />
      </div>
    </div>
  )
}
