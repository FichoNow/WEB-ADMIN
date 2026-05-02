"use server"

import { getUserStats } from "@/app/repositories/stats-repository"
import type { UserStatsResponse } from "@/app/types/admin/api/stats-response"

export async function getUserStatsAction(
  departmentId: number,
  userId: number,
  month?: number,
  year?: number,
): Promise<UserStatsResponse> {
  return getUserStats(departmentId, userId, month, year)
}
