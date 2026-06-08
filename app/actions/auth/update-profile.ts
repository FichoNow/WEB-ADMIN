"use server"

import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { updateOwnProfile } from "@/app/repositories/profile-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { profileSchema } from "@/app/types/auth/schemas/profile-schema"
import type { ProfileActionState } from "@/app/types/auth/action-states/profile-state"
import type { UpdateProfileRequest } from "@/app/types/auth/api/profile-request"

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.FORCE_HTTPS === "true",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
}

export async function updateProfileAction(
  data: unknown,
): Promise<ProfileActionState> {
  const t = await getTranslations("actions")
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) {
    return { error: await translateFirstIssue(parsed.error) }
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
    return { success: t("auth.profileUpdated") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.profileUpdate") }
  }
}
