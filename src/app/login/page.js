"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "No fue posible iniciar sesion");
      }

      login(payload);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message || "Ocurrio un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.32em] text-amber-400">Sesion</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Iniciar Sesion</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-amber-500"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />
          <input
            className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-colors focus:border-amber-500"
            name="password"
            onChange={handleChange}
            placeholder="Contraseña"
            required
            type="password"
            value={form.password}
          />

          {errorMessage ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="w-full rounded-md border border-amber-500/30 bg-white/5 px-4 py-2.5 font-medium text-zinc-100 backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-400">
          ¿No tienes cuenta?{" "}
          <Link className="text-amber-400 transition-colors hover:text-amber-300" href="/register">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
