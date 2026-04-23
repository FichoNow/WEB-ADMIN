"use server";

import { registerRequest } from "@/app/repositories/auth-repository";
import type { RegisterState } from "@/app/types/auth/register-state";

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const companyName = formData.get("company_name") as string;
  const companyCifNif = formData.get("company_cif_nif") as string;
  const companyEmail = formData.get("company_email") as string;
  const companyAddressLine = formData.get("company_address_line") as string;
  const companyCity = formData.get("company_city") as string;
  const companyPostalCode = formData.get("company_postal_code") as string;
  const userName = formData.get("user_name") as string;
  const userEmail = formData.get("user_email") as string;
  const userPassword = formData.get("user_password") as string;

  if (
    !companyName || !companyCifNif || !companyEmail || !companyAddressLine ||
    !companyCity || !companyPostalCode || !userName || !userEmail || !userPassword
  ) {
    return { error: "Todos los campos son obligatorios" };
  }

  if (userPassword.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  try {
    await registerRequest({
      company: {
        name: companyName,
        cif_nif: companyCifNif,
        email: companyEmail,
        address_line: companyAddressLine,
        city: companyCity,
        postal_code: companyPostalCode,
      },
      user: {
        name: userName,
        email: userEmail,
        password: userPassword,
      },
    });
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error de conexión. Comprueba tu internet." };
  }

  return { success: true };
}
