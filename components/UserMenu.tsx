'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { logout } from '@/app/actions/auth/logout'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  email: string
}

export default function UserMenu({ name, email }: Props) {
  const t = useTranslations('navbar')
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'border-divider bg-surface/60 text-text-primary hover:bg-surface gap-2 pl-1.5 pr-2',
        )}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-[11px] font-bold">
          {initials}
        </span>
        <span className="hidden sm:inline max-w-[160px] truncate font-medium">{name}</span>
        <ChevronDown className="w-4 h-4 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[220px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary truncate">{name}</span>
              {email && <span className="text-xs text-text-hint truncate">{email}</span>}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/dashboard/profile" />}
        >
          <Settings className="w-4 h-4" /> {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" /> {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
