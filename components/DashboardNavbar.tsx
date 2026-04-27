'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { logout } from '@/app/actions/logout'

import { Button, buttonVariants } from '@/components/ui/button'

export default function DashboardNavbar() {
  return (
    <Navbar fullWidth>
      <div className="flex items-center gap-2">
        <Link href="/" className={buttonVariants({ variant: "ghost", className: "text-text-secondary hover:text-text-primary" })}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la web
          </Link>

        <div className="w-px h-4 bg-divider mx-2" />

        <form action={logout}>
          <Button variant="ghost" type="submit" className="text-text-secondary hover:text-error hover:bg-error/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </Button>
        </form>
      </div>
    </Navbar>
  )
}
