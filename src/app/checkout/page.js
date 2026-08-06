"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";

const INITIAL_CUSTOMER_DATA = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `$${value}`;
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount);
}

function buildOrderSnapshot(cart) {
  return cart.map((item) => {
    const price = Number(item.guitar?.price || 0);
    const quantity = Number(item.quantity || 0);

    return {
      productId: String(item.guitar?._id || ""),
      name: String(item.guitar?.name || "Producto sin nombre"),
      image: String(item.guitar?.image || ""),
      price,
      quantity,
      options: {
        color: item.selectedOptions?.color || "",
        orientation: item.selectedOptions?.orientation || "",
        type: item.selectedOptions?.type || "",
        subtype: item.selectedOptions?.subtype || "",
      },
      subtotal: price * quantity,
    };
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useApp();
  const [customerData, setCustomerData] = useState(INITIAL_CUSTOMER_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && !orderNumber) {
      router.replace("/cart");
    }
  }, [cart.length, orderNumber, router]);

  const itemsSnapshot = useMemo(() => buildOrderSnapshot(cart), [cart]);
  const total = useMemo(
    () => itemsSnapshot.reduce((accumulator, item) => accumulator + item.subtotal, 0),
    [itemsSnapshot],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setCustomerData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerData,
          items: itemsSnapshot,
          total,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "No fue posible completar la compra");
      }

      setOrderNumber(payload.orderNumber);
      clearCart();
    } catch (error) {
      setErrorMessage(error.message || "Ocurrio un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-400">Compra Confirmada</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100 md:text-4xl">
            Gracias por elegir Luthier.io
          </h1>
          <p className="mt-4 text-zinc-400">
            Tu pedido fue registrado correctamente. Guarda este numero para seguimiento.
          </p>
          <p className="mt-8 font-mono text-5xl font-semibold text-amber-300">
            #{orderNumber}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-400">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Datos de facturacion</h1>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              name="name"
              onChange={handleChange}
              placeholder="Nombre completo"
              required
              value={customerData.name}
            />
            <input
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
              type="email"
              value={customerData.email}
            />
            <input
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              name="phone"
              onChange={handleChange}
              placeholder="Telefono"
              required
              value={customerData.phone}
            />
            <textarea
              className="min-h-28 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              name="address"
              onChange={handleChange}
              placeholder="Direccion"
              required
              value={customerData.address}
            />

            {errorMessage ? (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorMessage}
              </p>
            ) : null}

            <button
              className="w-full rounded-md bg-amber-500 px-4 py-2.5 font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || itemsSnapshot.length === 0}
              type="submit"
            >
              {isSubmitting ? "Procesando compra..." : "Finalizar Compra"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Resumen de orden</p>
          <ul className="mt-4 space-y-3">
            {itemsSnapshot.map((item) => (
              <li key={`${item.productId}-${item.options.type}-${item.options.subtype}-${item.options.color}-${item.options.orientation}`}>
                <p className="font-medium text-zinc-100">{item.name}</p>
                <p className="text-xs text-zinc-400">
                  {item.options.type} / {item.options.subtype} / {item.options.color} / {item.options.orientation}
                </p>
                <p className="font-mono text-sm text-amber-300">
                  {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.subtotal)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Total</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-amber-300">
              {formatCurrency(total)}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
