import { redirect } from "next/navigation";
import { getEmployees, listGroups } from "@/app/repositories/admin-repository";
import EmployeesClient from "./EmployeesClient";

interface Props {
  params: Promise<{ departmentId: string }>;
}

export default async function EmployeesPage({ params }: Props) {
  const { departmentId } = await params;
  const deptId = Number(departmentId);

  let employees;
  let groups;

  try {
    [employees, groups] = await Promise.all([
      getEmployees(deptId),
      listGroups(deptId),
    ]);
  } catch {
    redirect("/dashboard");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <EmployeesClient employees={employees} groups={groups} departmentId={deptId} />
    </div>
  );
}
