"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import OrderDetailView from "@/components/OrderDetailView";
import { useApp } from "@/context/AppContext";

export default function UserOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeUser } = useApp();
  const orderId = String(params?.id || "");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!activeUser) {
      router.replace("/login");
      return;
    }

    if (!orderId) {
      return;
    }

    async function loadOrder() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          `/api/users/${activeUser._id}/orders/${orderId}`,
          { cache: "no-store" },
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "No se pudo cargar la orden");
        }

        setOrder(payload);
      } catch (error) {
        setErrorMessage(error.message || "Error al cargar detalle");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [activeUser, orderId, router]);

  if (!activeUser) {
    return null;
  }

  if (!orderId) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-300 backdrop-blur-md">
          Orden invalida
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          Cargando detalle de orden...
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-5xl rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-300 backdrop-blur-md">
          {errorMessage}
        </div>
      </main>
    );
  }

  return (
    <OrderDetailView
      backHref="/user"
      backLabel="Volver al historial"
      order={order}
      showBackLink
      subtitle="Vista de lectura del pedido con snapshot exacto de la compra realizada."
      title="Detalle de tu compra"
    />
  );
}
