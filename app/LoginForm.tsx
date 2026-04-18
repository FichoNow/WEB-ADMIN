'use client'

import { useActionState } from "react";
import { login } from "./actions/auth";
import type { LoginState } from "./types/auth/login-state";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm px-6 py-12 flex flex-col gap-10">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-4xl font-light tracking-tight text-text-primary">
            AppProyecto
          </h1>
          <p className="text-sm font-light tracking-widest text-primary">
            JanFran
          </p>
        </div>

        {/* Form */}
        <form action={action} noValidate className="flex flex-col gap-4">
          {state?.error && (
            <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">
              {state.error}
            </p>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-text-secondary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
              className="w-full rounded-xl px-4 py-3 text-sm bg-surface border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-text-secondary">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl px-4 py-3 text-sm bg-surface border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl py-3 text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
