"use server"

import {
  getUserStats,
  getUserProjectHours,
  getProjectStats,
} from "@/app/repositories/stats-repository"
import type {
  UserStatsResponse,
  UserProjectHoursResponse,
  ProjectStatsResponse,
} from "@/app/types/admin/api/stats-response"

export async function getUserStatsAction(
  departmentId: number,
  userId: number,
  month?: number,
  year?: number,
): Promise<UserStatsResponse> {
  return getUserStats(departmentId, userId, month, year)
}

export async function getUserProjectHoursAction(
  departmentId: number,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<UserProjectHoursResponse> {
  return getUserProjectHours({ departmentId, month, year, groupId })
}

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
