"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginRequest } from "@/app/repositories/auth-repository";
import { loginSchema } from "@/app/types/auth/schemas/login-schema";
import type { LoginResponse } from "@/app/types/auth/api/login-response";
import type { LoginState } from "@/app/types/auth/states/login-state";

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  let data: LoginResponse;

  try {
    data = await loginRequest({ email, password });
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error de conexión. Comprueba tu internet." };
  }

  if (data.userData.role !== "ADMINISTRATOR" && data.userData.role !== "SUPERADMIN") {
    return {
      error: "No tienes permiso para acceder al panel de administración",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("userRole", data.userData.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}
