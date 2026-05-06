"use server"

import { revalidatePath } from "next/cache"
import { updateSuperadminRequest } from "@/app/repositories/company-repository"
import { editSuperadminSchema } from "@/app/types/superadmin/schemas/superadmin-schema"
import type { UpdateSuperadminRequest } from "@/app/types/superadmin/api/superadmin-request"

export type UpdateSuperadminState =
  | { error: string }
  | { success: string }
  | undefined

export async function updateSuperadminAction(
  id: number,
  data: unknown,
): Promise<UpdateSuperadminState> {
  const parsed = editSuperadminSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const body: UpdateSuperadminRequest = {}
  if (parsed.data.name) body.name = parsed.data.name.trim()
  if (parsed.data.email) body.email = parsed.data.email.trim().toLowerCase()

  if (!body.name && !body.email) {
    return { error: "Indica al menos un campo para actualizar" }
  }

  try {
    await updateSuperadminRequest(id, body)
    revalidatePath("/dashboard")
    return { success: "Administrador actualizado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo actualizar el administrador" }
  }
}
