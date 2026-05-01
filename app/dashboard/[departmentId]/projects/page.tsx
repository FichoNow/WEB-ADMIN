export default function ProjectsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Proyectos</p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Gestión de proyectos</h1>
        <p className="text-sm text-text-secondary">Crea y administra los proyectos activos del departamento.</p>
      </div>
      <div className="h-px bg-divider" />
      {/* TODO: implementar gestión de proyectos */}
    </div>
  )
}
