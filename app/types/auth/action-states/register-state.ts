export type RegisterState =
  | { success: true }
  | { fieldError: { field: string; message: string } }
  | { error: string }
  | undefined
