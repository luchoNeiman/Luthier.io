import Link from "next/link";

import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl">
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

        {categories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400">
            Todavia no hay colecciones cargadas.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                href={`/category/${category._id}`}
              >
                <h2 className="text-xl font-semibold text-zinc-100">
                  Coleccion: {category.name}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  {category.description || "Sin descripcion"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
