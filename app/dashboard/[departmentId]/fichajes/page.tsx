export default function FichajesPage() {
  return (
    <div className="px-10 py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Fichajes</p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Registro de jornada</h1>
        <p className="text-sm text-text-secondary">Consulta y corrige los registros de entrada y salida de los empleados.</p>
      </div>
      <div className="h-px bg-divider" />
      {/* TODO: implementar gestión de fichajes */}
    </div>
  )
}
