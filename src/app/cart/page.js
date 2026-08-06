"use client";

import Image from "next/image";
import Link from "next/link";

import { useApp } from "@/context/AppContext";

function getImageSrc(image) {
  if (!image) {
    return "";
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/guitars/${image}`;
}

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

export default function CartPage() {
  const { cart, incrementCartItem, decrementCartItem, removeFromCart } = useApp();

  const total = cart.reduce(
    (accumulator, item) => accumulator + Number(item.guitar?.price || 0) * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Carrito</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100 md:text-4xl">
            Tu carrito esta vacio
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Explora el Custom Shop y agrega una configuracion para comenzar tu compra.
          </p>

          <Link
            className="mt-8 inline-flex rounded-md border border-amber-500/50 bg-amber-500/20 px-5 py-2.5 font-medium text-amber-300 transition-colors hover:bg-amber-500/30"
            href="/customize"
          >
            Ir al Custom Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-400">Carrito</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100 md:text-4xl">
            Configuraciones listas para checkout
          </h1>
        </header>

        <section className="space-y-4">
          {cart.map((item) => {
            const unitPrice = Number(item.guitar?.price || 0);
            const subtotal = unitPrice * item.quantity;

            return (
              <article
                key={item.cartItemId}
                className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md md:grid-cols-[160px_1fr_auto]"
              >
                <div className="relative h-40 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  {item.guitar?.image ? (
                    <Image
                      alt={item.guitar.name || "Guitarra"}
                      className="object-contain object-center p-2"
                      fill
                      sizes="(min-width: 768px) 160px, 100vw"
                      src={getImageSrc(item.guitar.image)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-zinc-100">{item.guitar?.name}</h2>
                  <p className="text-sm text-zinc-400">
                    {item.selectedOptions.type} / {item.selectedOptions.subtype} /{" "}
                    {item.selectedOptions.color} / {item.selectedOptions.orientation}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Precio unitario: <span className="font-mono text-zinc-200">{formatCurrency(unitPrice)}</span>
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="h-8 w-8 rounded-md border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-400 hover:text-amber-300"
                      onClick={() => decrementCartItem(item.cartItemId)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center font-mono text-zinc-100">{item.quantity}</span>
                    <button
                      className="h-8 w-8 rounded-md border border-zinc-700 text-zinc-300 transition-colors hover:border-amber-400 hover:text-amber-300"
                      onClick={() => incrementCartItem(item.cartItemId)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                  <p className="font-mono text-lg font-semibold text-amber-300">
                    {formatCurrency(subtotal)}
                  </p>
                  <button
                    className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20"
                    onClick={() => removeFromCart(item.cartItemId)}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Total General</p>
              <p className="mt-2 font-mono text-3xl font-semibold text-amber-300">
                {formatCurrency(total)}
              </p>
            </div>

            <Link
              className="rounded-md bg-amber-500 px-5 py-2.5 font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
              href="/checkout"
            >
              Proceder al Checkout
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
