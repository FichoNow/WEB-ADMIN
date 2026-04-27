import { redirect } from "next/navigation";
import { getEmployees } from "@/app/repositories/admin-repository";
import EmployeesClient from "./EmployeesClient";

interface Props {
  params: Promise<{ departmentId: string }>;
}

export default async function EmployeesPage({ params }: Props) {
  const { departmentId } = await params;
  const deptId = Number(departmentId);

  let employees;

  try {
    employees = await getEmployees(deptId);
  } catch {
    redirect("/dashboard");
  }

  return (
    <div className="px-10 py-12 flex flex-col gap-6">
      <EmployeesClient employees={employees} departmentId={deptId} />
    </div>
  );
}
