import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

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

export default async function CategoriesPage() {
  await connectDB();

  const categories = await Category.find()
    .sort({ name: 1 })
    .populate({
      path: "guitars",
      model: Guitar,
      localField: "_id",
      foreignField: "categories",
      strictPopulate: false,
    })
    .lean();

  const collectionsWithGuitars = categories.filter(
    (category) => Array.isArray(category.guitars) && category.guitars.length > 0,
  );

  const bentoPatterns = ["md:col-span-2", "", "", "md:col-span-2", "", ""];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
            Colecciones
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-zinc-100">
            Colecciones comerciales del catalogo
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            Cada coleccion agrupa guitarras por criterio comercial para la
            navegacion publica.
          </p>
        </section>

        {collectionsWithGuitars.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400">
            Todavia no hay colecciones con guitarras asociadas.
          </p>
        ) : (
          <div className="space-y-10">
            {collectionsWithGuitars.map((category) => (
              <section key={category._id.toString()} className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-100 md:text-3xl">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {category.description || "Coleccion comercial sin descripcion."}
                    </p>
                  </div>

                  <Link
                    className="rounded-md border border-zinc-700 bg-black/30 px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-300 transition-all hover:border-amber-500/50 hover:text-amber-300"
                    href={`/category/${category._id}`}
                  >
                    Ver coleccion
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px]">
                  {category.guitars.map((guitar, index) => (
                    <article
                      key={guitar._id.toString()}
                      className={`rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] ${bentoPatterns[index % bentoPatterns.length]}`}
                    >
                      <div className="relative h-[200px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                        {guitar.image ? (
                          <Image
                            alt={guitar.name || "Guitarra"}
                            className="object-contain object-center p-2"
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            src={getGuitarImageSrc(guitar.image)}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <p className="line-clamp-2 text-base font-semibold text-zinc-100">
                          {guitar.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
                          {guitar.brand} {guitar.model}
                        </p>
                        <p className="mt-3 font-mono text-sm font-semibold text-amber-300">
                          {formatCurrency(guitar.price)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
