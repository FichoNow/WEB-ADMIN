import { toast } from 'sonner'

type ActionResult = { error: string } | { success: string } | undefined | null | void

export function toastActionResult(result: ActionResult): result is { success: string } | { error: string } {
  if (!result) return false
  if ('success' in result) {
    toast.success(result.success)
    return true
  }
  if ('error' in result) {
    toast.error(result.error)
    return true
  }
  return false
}
