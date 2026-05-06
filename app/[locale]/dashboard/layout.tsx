import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardFooter from '@/components/DashboardFooter'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <div className="flex-1">
        {children}
      </div>
      <DashboardFooter />
    </>
  )
}
