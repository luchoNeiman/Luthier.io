import Link from "next/link";

import { formatCurrency, getGuitarImageSrc } from "@/lib/shopUi";

import OrderStatusBadge from "./OrderStatusBadge";

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrderDetailView({
  order,
  title,
  subtitle,
  showBackLink,
  backHref,
  backLabel,
  statusControl,
}) {
  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-3">
          {showBackLink ? (
            <Link
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-amber-300"
              href={backHref}
            >
              {backLabel}
            </Link>
          ) : null}
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Orden #{order.orderNumber}</p>
          <h1 className="text-3xl font-semibold text-zinc-100 md:text-4xl">{title}</h1>
          <p className="max-w-3xl text-sm text-zinc-400 md:text-base">{subtitle}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Fecha</p>
            <p className="mt-2 text-sm text-zinc-100">{formatDate(order.createdAt)}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Estado</p>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Total</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-amber-300">
              {formatCurrency(order.total)}
            </p>
          </article>
        </section>

        {statusControl ? (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            {statusControl}
          </section>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Datos de envio</p>
            <dl className="mt-4 space-y-3 text-sm text-zinc-300">
              <div>
                <dt className="text-zinc-500">Nombre</dt>
                <dd className="text-zinc-100">{order.customerData?.name || "-"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="text-zinc-100">{order.customerData?.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Telefono</dt>
                <dd className="text-zinc-100">{order.customerData?.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Direccion</dt>
                <dd className="text-zinc-100">{order.customerData?.address || "-"}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Snapshot de compra</p>
            <ul className="mt-4 space-y-4">
              {order.items?.map((item, index) => {
                const imageSrc = getGuitarImageSrc(item.image);
                const uniqueKey = `${item.productId}-${index}-${item.subtotal}`;

                return (
                  <li
                    className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-3 sm:grid-cols-[92px_1fr]"
                    key={uniqueKey}
                  >
                    <div className="h-24 overflow-hidden rounded-md border border-white/10 bg-zinc-900">
                      {imageSrc ? (
                        <img
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={imageSrc}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-zinc-100">{item.name}</p>
                      <p className="text-xs text-zinc-400">
                        {item.options?.type || "-"} / {item.options?.subtype || "-"} / {item.options?.color || "-"} / {item.options?.orientation || "-"}
                      </p>
                      <p className="text-xs text-zinc-400">Cantidad: {item.quantity}</p>
                      <p className="font-mono text-sm text-amber-300">
                        {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
