"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { formatCurrency, getGuitarImageSrc } from "@/lib/shopUi";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    latestUsers: [],
    lowStockProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMetrics() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/dashboard/metrics", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudieron cargar metricas");
        }

        setMetrics({
          totalRevenue: Number(payload.totalRevenue || 0),
          latestUsers: Array.isArray(payload.latestUsers) ? payload.latestUsers : [],
          lowStockProducts: Array.isArray(payload.lowStockProducts)
            ? payload.lowStockProducts
            : [],
        });
      } catch (error) {
        setErrorMessage(error.message || "Error en dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const lowStockCount = useMemo(() => metrics.lowStockProducts.length, [metrics]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.26em] text-amber-400">Panel Admin</p>
          <h1 className="text-4xl font-semibold text-zinc-100 md:text-5xl">Dashboard Luthier.io</h1>
          <p className="max-w-3xl text-sm text-zinc-400 md:text-base">
            Lectura operativa de ventas, clientes recientes y productos criticos de stock.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-md lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Total Recaudado Historico</p>
            {isLoading ? (
              <p className="mt-3 text-zinc-400">Cargando...</p>
            ) : (
              <p className="mt-4 font-mono text-4xl font-semibold text-amber-300 md:text-5xl">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            )}
            <p className="mt-3 text-xs text-zinc-500">No incluye ordenes canceladas.</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-md lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Ultimos Usuarios</p>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                {metrics.latestUsers.length} registros
              </span>
            </div>

            {isLoading ? (
              <p className="mt-3 text-zinc-400">Cargando...</p>
            ) : (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {metrics.latestUsers.map((user) => (
                  <li
                    className="rounded-lg border border-white/10 bg-black/25 px-3 py-3"
                    key={user._id}
                  >
                    <p className="font-medium text-zinc-100">{user.name}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      Alta: {formatDate(user.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-md lg:col-span-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Alertas Stock Bajo</p>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-amber-300">
                {lowStockCount} items
              </span>
            </div>

            {isLoading ? (
              <p className="mt-3 text-zinc-400">Cargando...</p>
            ) : metrics.lowStockProducts.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.lowStockProducts.map((guitar) => (
                  <li
                    className="rounded-lg border border-white/10 bg-black/25 p-3"
                    key={guitar._id}
                  >
                    <div className="h-24 overflow-hidden rounded-md border border-white/10 bg-zinc-900">
                      {getGuitarImageSrc(guitar.image) ? (
                        <img
                          alt={guitar.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={getGuitarImageSrc(guitar.image)}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-medium text-zinc-100">{guitar.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">Stock actual: {guitar.stock}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-zinc-400">No hay productos en rango critico.</p>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-md lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Accesos Rapidos</p>
            <div className="mt-4 space-y-3">
              <Link
                className="block rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                href="/dashboard/orders"
              >
                Gestion de Ordenes
              </Link>
              <Link
                className="block rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                href="/dashboard/catalog"
              >
                Revisar Catalogo
              </Link>
            </div>
          </article>
        </section>

        {errorMessage ? (
          <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </main>
  );
}
