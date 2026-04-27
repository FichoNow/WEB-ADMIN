import DashboardNavbar from './DashboardNavbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  )
}
