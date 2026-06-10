import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Navbar from '@/components/Navbar'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import UserMenu from '@/components/UserMenu'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function DashboardNavbar() {
  const cookieStore = await cookies()
  const t = await getTranslations('navbar')
  const name = cookieStore.get('userName')?.value ?? t('myAccount')
  const email = cookieStore.get('userEmail')?.value ?? ''

  return (
    <Navbar fullWidth>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        <Link
          href="/"
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className: 'border-divider bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-surface gap-2',
          })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('backToWeb')}</span>
        </Link>
        <div className="w-px h-6 bg-divider mx-1" />
        <UserMenu name={name} email={email} />
      </div>
    </Navbar>
  )
}
