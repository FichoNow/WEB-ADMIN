"use server"

import { cookies } from "next/headers"
import { updateOwnProfile } from "@/app/repositories/profile-repository"
import { profileSchema } from "@/app/types/auth/schemas/profile-schema"
import type { ProfileActionState } from "@/app/types/auth/action-states/profile-state"
import type { UpdateProfileRequest } from "@/app/types/auth/api/profile-request"

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
}

export async function updateProfileAction(
  data: unknown,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data
  const body: UpdateProfileRequest = {}
  if (name) body.name = name
  if (email) body.email = email.toLowerCase()
  if (password) body.password = password

  try {
    const updated = await updateOwnProfile(body)
    const cookieStore = await cookies()
    if (updated.name) cookieStore.set("userName", updated.name, COOKIE_OPTS)
    if (updated.email) cookieStore.set("userEmail", updated.email, COOKIE_OPTS)
    return { success: "Perfil actualizado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se ha podido actualizar el perfil" }
  }
}
