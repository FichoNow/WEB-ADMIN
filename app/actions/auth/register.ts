"use server";

import { registerRequest } from "@/app/repositories/auth-repository";
import { registerSchema } from "@/app/types/auth/schemas/register-schema";
import type { RegisterState } from "@/app/types/auth/action-states/register-state";

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const first = result.error.issues[0];
    return {
      fieldError: { field: first.path[0] as string, message: first.message },
    };
  }

  const d = result.data;

  try {
    await registerRequest({
      company: {
        name: d.company_name.trim(),
        cif_nif: d.company_cif_nif.trim(),
        email: d.company_email.trim().toLowerCase(),
        address_line: d.company_address_line.trim(),
        city: d.company_city.trim(),
        postal_code: d.company_postal_code.trim(),
      },
      user: {
        name: d.user_name.trim(),
        email: d.user_email.trim().toLowerCase(),
        password: d.user_password,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("email")) {
      return { fieldError: { field: "user_email", message: err.message } };
    }
    if (err instanceof Error && err.message.includes("CIF/NIF")) {
      return { fieldError: { field: "company_cif_nif", message: err.message } };
    }
    if (err instanceof Error) return { error: err.message };
    return { error: "Error de conexión. Comprueba tu internet." };
  }

  return { success: true };
}
