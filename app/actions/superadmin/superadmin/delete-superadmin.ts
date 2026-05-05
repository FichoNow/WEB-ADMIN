"use server"

import { revalidatePath } from "next/cache"
import { deleteSuperadminRequest } from "@/app/repositories/company-repository"

export type DeleteSuperadminState =
  | { error: string }
  | { success: string }
  | undefined

export async function deleteSuperadminAction(id: number): Promise<DeleteSuperadminState> {
  if (!Number.isFinite(id) || id <= 0) {
    return { error: "Id inválido" }
  }
  try {
    await deleteSuperadminRequest(id)
    revalidatePath("/dashboard")
    return { success: "Administrador eliminado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo eliminar el administrador" }
  }
}
