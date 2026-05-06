import { redirect } from "next/navigation";
import { getEmployees } from "@/app/repositories/employees-repository";
import { listGroups } from "@/app/repositories/groups-repository";
import { getScheduleAssignments } from "@/app/repositories/schedules-repository";
import EmployeesClient from "./EmployeesClient";

interface Props {
  params: Promise<{ departmentId: string; locale: string }>;
}

export default async function EmployeesPage({ params }: Props) {
  const { departmentId, locale } = await params;
  const deptId = Number(departmentId);

  let employees;
  let groups;
  let assignments;

  try {
    [employees, groups, assignments] = await Promise.all([
      getEmployees(deptId),
      listGroups(deptId),
      getScheduleAssignments(deptId),
    ]);
  } catch {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <EmployeesClient
        employees={employees}
        groups={groups}
        assignments={assignments}
        departmentId={deptId}
      />
    </div>
  );
}
