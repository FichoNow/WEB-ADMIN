"use server"

import { getProjectStats } from "@/app/repositories/stats-repository"
import type { ProjectStatsResponse } from "@/app/types/admin/api/stats-response"

export async function getProjectStatsAction(
  departmentId: number,
  projectName: string,
  month?: number,
  year?: number,
  allTime?: boolean,
): Promise<ProjectStatsResponse> {
  if (allTime) {
    return getProjectStats(departmentId, projectName)
  }
  return getProjectStats(departmentId, projectName, month, year)
}
