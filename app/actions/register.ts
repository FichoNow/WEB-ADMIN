"use server";

import { registerRequest } from "@/app/repositories/auth-repository";
import type { RegisterState } from "@/app/types/auth/register-state";

const field = (f: string, msg: string): RegisterState => ({ fieldError: { field: f, message: msg } });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const companyName        = (formData.get("company_name")         as string).trim();
  const companyCifNif      = (formData.get("company_cif_nif")      as string).trim();
  const companyEmail       = (formData.get("company_email")        as string).trim().toLowerCase();
  const companyAddressLine = (formData.get("company_address_line") as string).trim();
  const companyCity        = (formData.get("company_city")         as string).trim();
  const companyPostalCode  = (formData.get("company_postal_code")  as string).trim();
  const userName           = (formData.get("user_name")            as string).trim();
  const userEmail          = (formData.get("user_email")           as string).trim().toLowerCase();
  const userPassword       =  formData.get("user_password")        as string;

  if (!companyName)                                    return field("company_name",         "Obligatorio");
  if (companyName.length > 150)                        return field("company_name",         "Máximo 150 caracteres");
  if (!companyCifNif)                                  return field("company_cif_nif",      "Obligatorio");
  if (companyCifNif.length > 20)                       return field("company_cif_nif",      "Máximo 20 caracteres");
  if (!companyEmail)                                   return field("company_email",        "Obligatorio");
  if (!EMAIL_REGEX.test(companyEmail))                 return field("company_email",        "Email inválido");
  if (!companyAddressLine)                             return field("company_address_line", "Obligatorio");
  if (companyAddressLine.length > 200)                 return field("company_address_line", "Máximo 200 caracteres");
  if (!companyCity)                                    return field("company_city",         "Obligatorio");
  if (companyCity.length > 100)                        return field("company_city",         "Máximo 100 caracteres");
  if (!companyPostalCode)                              return field("company_postal_code",  "Obligatorio");
  if (companyPostalCode.length > 10)                   return field("company_postal_code",  "Máximo 10 caracteres");
  if (!userName)                                       return field("user_name",            "Obligatorio");
  if (userName.length > 100)                           return field("user_name",            "Máximo 100 caracteres");
  if (!userEmail)                                      return field("user_email",           "Obligatorio");
  if (!EMAIL_REGEX.test(userEmail))                    return field("user_email",           "Email inválido");
  if (!userPassword)                                   return field("user_password",        "Obligatorio");
  if (userPassword.length < 8)                         return field("user_password",        "Mínimo 8 caracteres");

  try {
    await registerRequest({
      company: { name: companyName, cif_nif: companyCifNif, email: companyEmail, address_line: companyAddressLine, city: companyCity, postal_code: companyPostalCode },
      user:    { name: userName, email: userEmail, password: userPassword },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('email')) {
      return field("user_email", err.message);
    }
    if (err instanceof Error) return { error: err.message };
    return { error: "Error de conexión. Comprueba tu internet." };
  }

  return { success: true };
}
