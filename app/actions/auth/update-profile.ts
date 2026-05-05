"use server"

import { updateOwnProfile } from "@/app/repositories/profile-repository"
import { profileSchema } from "@/app/types/auth/schemas/profile-schema"
import type { ProfileActionState } from "@/app/types/auth/states/profile-state"

export async function updateProfileAction(
  data: unknown,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data
  const body: { name?: string; email?: string; password?: string } = {}
  if (name) body.name = name
  if (email) body.email = email.toLowerCase()
  if (password) body.password = password

  try {
    await updateOwnProfile(body)
    return { success: "Perfil actualizado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se ha podido actualizar el perfil" }
  }
}
