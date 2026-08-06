"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import OrderStatusBadge from "@/components/OrderStatusBadge";
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

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar el listado");
        }

        setOrders(Array.isArray(payload) ? payload : []);
      } catch (error) {
        setErrorMessage(error.message || "Error al cargar ordenes");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-400">Administracion</p>
          <h1 className="text-3xl font-semibold text-zinc-100 md:text-4xl">Todas las Ordenes</h1>
          <p className="text-sm text-zinc-400">Control completo de ventas y estado logistico.</p>
        </header>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          {isLoading ? <p className="text-sm text-zinc-400">Cargando ordenes...</p> : null}
          {errorMessage ? (
            <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          {!isLoading && !errorMessage ? (
            orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      <th className="px-3 py-2">Orden</th>
                      <th className="px-3 py-2">Cliente</th>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Estado</th>
                      <th className="px-3 py-2">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr className="rounded-lg border border-white/10 bg-black/25" key={order._id}>
                        <td className="px-3 py-3 font-mono text-zinc-100">#{order.orderNumber}</td>
                        <td className="px-3 py-3 text-zinc-300">
                          <p>{order.customerData?.name || order.user?.name || "Sin nombre"}</p>
                          <p className="text-xs text-zinc-500">{order.customerData?.email || order.user?.email || ""}</p>
                        </td>
                        <td className="px-3 py-3 text-zinc-300">{formatDate(order.createdAt)}</td>
                        <td className="px-3 py-3 font-mono text-amber-300">{formatCurrency(order.total)}</td>
                        <td className="px-3 py-3"><OrderStatusBadge status={order.status} /></td>
                        <td className="px-3 py-3">
                          <Link
                            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:text-amber-300"
                            href={`/dashboard/order/${order._id}`}
                          >
                            Gestionar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No hay ventas registradas.</p>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
