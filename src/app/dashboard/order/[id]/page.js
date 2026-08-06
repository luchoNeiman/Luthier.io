"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import OrderDetailView from "@/components/OrderDetailView";

const STATUS_OPTIONS = ["Active", "Closed", "Shipped", "Canceled"];

export default function DashboardOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState("Active");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const orderId = String(params?.id || "");
    if (!orderId) {
      setErrorMessage("Orden invalida");
      setIsLoading(false);
      return;
    }

    async function loadOrder() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar la orden");
        }

        setOrder(payload);
        setNextStatus(payload.status || "Active");
      } catch (error) {
        setErrorMessage(error.message || "Error al cargar la orden");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [params]);

  const statusControl = useMemo(() => {
    if (!order) {
      return null;
    }

    return (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Gestion de estado</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:max-w-xs"
            onChange={(event) => setNextStatus(event.target.value)}
            value={nextStatus}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || nextStatus === order.status}
            onClick={async () => {
              setIsSaving(true);
              setErrorMessage("");
              setMessage("");

              try {
                const response = await fetch(`/api/orders/${order._id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status: nextStatus }),
                });

                const payload = await response.json();

                if (!response.ok) {
                  throw new Error(payload?.message || "No se pudo actualizar el estado");
                }

                setOrder(payload);
                setNextStatus(payload.status || nextStatus);
                setMessage("Estado actualizado correctamente");
              } catch (error) {
                setErrorMessage(error.message || "Error al guardar estado");
              } finally {
                setIsSaving(false);
              }
            }}
            type="button"
          >
            {isSaving ? "Guardando..." : "Actualizar estado"}
          </button>
        </div>

        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
      </div>
    );
  }, [errorMessage, isSaving, nextStatus, order, message]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          Cargando orden...
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-300 backdrop-blur-md">
          {errorMessage || "No se encontro la orden"}
        </div>
      </main>
    );
  }

  return (
    <OrderDetailView
      backHref="/dashboard/orders"
      backLabel="Volver a ventas"
      order={order}
      showBackLink
      statusControl={statusControl}
      subtitle="Vista administrativa con edicion de estado para seguimiento operativo."
      title="Gestion de orden"
    />
  );
}
