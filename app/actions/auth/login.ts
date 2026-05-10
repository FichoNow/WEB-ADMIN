"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { loginRequest } from "@/app/repositories/auth-repository";
import { translateFirstIssue } from "@/app/lib/translate-zod";
import { loginSchema } from "@/app/types/auth/schemas/login-schema";
import type { LoginResponse } from "@/app/types/auth/api/login-response";
import type { LoginState } from "@/app/types/auth/action-states/login-state";

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const t = await getTranslations("actions.auth");
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: await translateFirstIssue(result.error) };
  }

  const { email, password } = result.data;

  let data: LoginResponse;

  try {
    data = await loginRequest({ email, password });
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: t("connectionError") };
  }

  if (data.userData.role !== "ADMINISTRATOR" && data.userData.role !== "SUPERADMIN") {
    return {
      error: t("noAdminAccess"),
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

  cookieStore.set("userName", data.userData.name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("userEmail", data.userData.email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const locale = await getLocale();
  redirect(`/${locale}/dashboard`);
}
