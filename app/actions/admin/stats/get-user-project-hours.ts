"use server"

import { getUserProjectHours } from "@/app/repositories/stats-repository"
import type { UserProjectHoursResponse } from "@/app/types/admin/api/stats-response"

export async function getUserProjectHoursAction(
  departmentId: number,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<UserProjectHoursResponse> {
  return getUserProjectHours({ departmentId, month, year, groupId })
}
