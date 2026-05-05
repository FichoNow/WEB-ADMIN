import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProfileForm from './ProfileForm'

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-4 mb-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-hint hover:text-text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al panel
        </Link>

        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-text-primary leading-tight">
            Mi perfil
          </h1>
          <p className="text-xs sm:text-sm text-text-hint font-medium leading-relaxed mt-1">
            Actualiza tu nombre, email o contraseña.
          </p>
        </div>
        <div className="h-px bg-divider/60" />
      </div>

      <div className="rounded-[2rem] border border-divider bg-surface p-6 sm:p-10">
        <ProfileForm />
      </div>
    </div>
  )
}
