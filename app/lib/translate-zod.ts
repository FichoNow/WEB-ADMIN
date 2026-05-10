import { getTranslations } from "next-intl/server"
import type { ZodError } from "zod"

/**
 * Traduce el primer issue de un ZodError. Los esquemas devuelven claves
 * tipo "validation.required"; aquí las resolvemos contra los mensajes.
 */
export async function translateFirstIssue(error: ZodError): Promise<string> {
  const t = await getTranslations()
  const key = error.issues[0]?.message ?? "validation.required"
  return t(key)
}
