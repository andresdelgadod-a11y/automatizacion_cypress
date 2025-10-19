import Link from "next/link"

interface EncabezadoProps {
  usuarioActual?: {
    nombre: string
    rol: string
  } | null
}

export default function Encabezado({ usuarioActual }: EncabezadoProps) {
  return (
    <header className="bg-[#0d7c66] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#0d7c66] text-xl">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">JUSTICIA VERDE</h1>
              <p className="text-xs text-green-100">Denuncias ambientales</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-green-200 transition-colors">
              Inicio
            </Link>

            {usuarioActual ? (
              <>
                {usuarioActual.rol === "ciudadano" && (
                  <Link href="/ciudadano/panel" className="hover:text-green-200 transition-colors">
                    Mis Denuncias
                  </Link>
                )}
                {usuarioActual.rol === "revisor" && (
                  <Link href="/revisor/panel" className="hover:text-green-200 transition-colors">
                    Panel Revisor
                  </Link>
                )}
                {usuarioActual.rol === "admin" && (
                  <Link href="/admin/panel" className="hover:text-green-200 transition-colors">
                    Administración
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-sm">{usuarioActual.nombre}</span>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-white text-[#0d7c66] px-4 py-2 rounded-full hover:bg-green-50 transition-colors"
              >
                Cuenta
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
