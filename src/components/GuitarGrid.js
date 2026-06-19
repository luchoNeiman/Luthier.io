import Image from "next/image";
import Link from "next/link";

function getGuitarImageSrc(image) {
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

export default function GuitarGrid({ guitars = [] }) {
  if (guitars.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-600 shadow-sm">
        Todavia no hay guitarras cargadas.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guitars.map((guitar) => (
        <article
          key={guitar._id}
          className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-stone-200 shadow-sm"
        >
          <div className="relative aspect-[4/3] bg-zinc-800">
            {guitar.image ? (
              <Image
                alt={guitar.name || "Guitarra de Autor Custom"}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={getGuitarImageSrc(guitar.image)}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-400">
                Sin imagen
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.15em]">
              {guitar.type ? (
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-400">
                  {guitar.type}
                </span>
              ) : null}
              {guitar.subtype && guitar.subtype !== "No aplica" ? (
                <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-stone-300">
                  {guitar.subtype}
                </span>
              ) : null}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2 className="mt-3 text-lg font-semibold text-stone-100">
                {guitar.name}
              </h2>
              <p className="mt-3 shrink-0 font-mono text-base font-semibold text-amber-400">
                {formatCurrency(guitar.price)}
              </p>
            </div>

            {/* <p className="mt-2 line-clamp-3 text-sm text-slate-600">
              {guitar.description || "Sin descripcion"}
            </p> */}

            {guitar.categories?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {guitar.categories.map((category) =>
                  typeof category === "string" ? (
                    <span
                      key={category}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-stone-300"
                    >
                      {category}
                    </span>
                  ) : (
                    <Link
                      key={category._id}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300"
                      href={`/category/${category._id}`}
                    >
                      {category.name}
                    </Link>
                  )
                )}
              </div>
            ) : null}

            <p className="mt-4 border-t border-zinc-800 pt-3 font-mono text-xs uppercase tracking-[0.12em] text-stone-400">
              Stock: {String(guitar.stock).padStart(2, "0")}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
