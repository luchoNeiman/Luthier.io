"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/shopUi";

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

export default function UserPage() {
  const router = useRouter();
  const { activeUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!activeUser) {
      router.replace("/login");
      return;
    }

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/users/${activeUser._id}/orders`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar tu historial");
        }

        setOrders(Array.isArray(payload) ? payload : []);
      } catch (error) {
        setErrorMessage(error.message || "Error al cargar historial");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [activeUser, router]);

  if (!activeUser) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-400">Panel de Usuario</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-100">Hola, {activeUser.name}</h1>
          <p className="mt-2 text-sm text-zinc-400">Email: {activeUser.email}</p>
        </header>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-zinc-100">Historial de Compras</h2>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
              {orders.length} ordenes
            </span>
          </div>

          {isLoading ? <p className="mt-4 text-sm text-zinc-400">Cargando ordenes...</p> : null}
          {errorMessage ? (
            <p className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          {!isLoading && !errorMessage ? (
            orders.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      <th className="px-3 py-2">Numero</th>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2">Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr className="rounded-lg border border-white/10 bg-black/25" key={order._id}>
                        <td className="px-3 py-3 font-mono text-zinc-100">#{order.orderNumber}</td>
                        <td className="px-3 py-3 text-zinc-300">{formatDate(order.createdAt)}</td>
                        <td className="px-3 py-3 font-mono text-amber-300">{formatCurrency(order.total)}</td>
                        <td className="px-3 py-3"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-3 py-3">
                          <Link
                            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:text-amber-300"
                            href={`/user/order/${order._id}`}
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-400">Todavia no registras compras.</p>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
