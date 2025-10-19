import Encabezado from "@/componentes/encabezado"
import PanelRevisor from "@/componentes/panel-revisor"

export default function PaginaPanelRevisor() {
  // TODO: Obtener usuario autenticado
  const revisorId = 3 // Simulado

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Encabezado
        usuarioActual={{
          nombre: "Dr. Carlos Mendoza",
          rol: "revisor",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <PanelRevisor revisorId={revisorId} />
      </div>
    </div>
  )
}
