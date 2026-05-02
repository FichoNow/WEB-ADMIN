'use client'

import { SidebarProvider, useSidebar } from './SidebarContext'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
  departmentId: string
  departmentName: string
  companyName: string
  isSuperAdmin: boolean
}

function Inner({ children, departmentId, departmentName, companyName, isSuperAdmin }: Props) {
  const { open, close } = useSidebar()
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar
        departmentId={departmentId}
        departmentName={departmentName}
        companyName={companyName}
        isSuperAdmin={isSuperAdmin}
        open={open}
        onClose={close}
      />
      <main className="flex-1 bg-bg pb-12 min-w-0">
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout(props: Props) {
  return (
    <SidebarProvider>
      <Inner {...props} />
    </SidebarProvider>
  )
}
