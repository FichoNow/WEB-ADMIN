export type RegisterState = { error: string } | { fieldError: { field: string; message: string } } | { success: true } | undefined;
