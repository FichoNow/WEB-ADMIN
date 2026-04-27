export default function RequestsPage() {
  return (
    <div className="px-10 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Solicitudes</p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Solicitudes de ausencia</h1>
        <p className="text-sm text-text-secondary">Revisa y gestiona las peticiones de vacaciones, permisos y bajas del departamento.</p>
      </div>
      <div className="h-px bg-divider" />
      {/* TODO: implementar gestión de solicitudes */}
    </div>
  )
}
