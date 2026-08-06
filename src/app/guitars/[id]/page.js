import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import GuitarDetailActions from "@/components/GuitarDetailActions";
import { getGuitarById } from "@/lib/guitars";
import { formatCurrency, getGuitarImageSrc } from "@/lib/shopUi";

export const dynamic = "force-dynamic";

const SPEC_FIELDS = [
  ["Marca", "brand"],
  ["Modelo", "model"],
  ["Tipo", "type"],
  ["Subtipo", "subtype"],
  ["Orientación", "orientation"],
  ["Color", "color"],
  ["Material de cuerdas", "stringMaterial"],
  ["Cantidad de cuerdas", "stringCount"],
  ["Cantidad de trastes", "fretCount"],
  ["Pastillas", "pickupConfig"],
];

export default async function GuitarDetailPage({ params }) {
  const { id } = await params;
  const guitar = await getGuitarById(id);

  if (!guitar) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          className="inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-amber-500/50 hover:text-amber-300"
          href="/"
        >
          Volver al catálogo
        </Link>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] backdrop-blur-md lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
            <Image
              alt={guitar.name || "Detalle de guitarra"}
              className="object-contain object-center p-6"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={getGuitarImageSrc(guitar.image)}
            />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
                {guitar.type ? (
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
                    {guitar.type}
                  </span>
                ) : null}
                {guitar.subtype && guitar.subtype !== "No aplica" ? (
                  <span className="rounded-md border border-white/10 bg-black/30 px-3 py-1 text-zinc-300">
                    {guitar.subtype}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                {guitar.name}
              </h1>
              <p className="mt-4 font-mono text-3xl font-semibold text-amber-300">
                {formatCurrency(guitar.price)}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-zinc-500">
                Stock disponible: {String(guitar.stock).padStart(2, "0")}
              </p>
            </div>

            <GuitarDetailActions guitar={guitar} />

            <div className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
              {SPEC_FIELDS.map(([label, key]) => (
                <div key={key} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">
                    {String(guitar[key] ?? "-")}
                  </p>
                </div>
              ))}
            </div>

            {guitar.categories?.length ? (
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Colecciones asociadas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {guitar.categories.map((category) => (
                    <span
                      key={typeof category === "string" ? category : category._id}
                      className="rounded-md border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300"
                    >
                      {typeof category === "string" ? category : category.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
