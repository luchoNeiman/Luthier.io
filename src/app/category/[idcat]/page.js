import Link from "next/link";
import { notFound } from "next/navigation";

import GuitarGrid from "@/components/GuitarGrid";
import { getCategoryById } from "@/lib/categories";
import { getGuitarsByCategory } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function CategoryGuitarsPage({ params }) {
  const { idcat } = await params;
  const category = await getCategoryById(idcat);

  if (!category) {
    notFound();
  }

  const guitars = await getGuitarsByCategory(category._id);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl">
        <Link
          className="text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
          href="/"
        >
          Volver al catalogo
        </Link>

        <section className="mb-8 mt-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
            Coleccion
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-zinc-100">
            Catalogo de la coleccion: {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-base text-zinc-400">
              {category.description}
            </p>
          ) : null}
        </section>

        <GuitarGrid guitars={guitars} />
      </div>
    </main>
  );
}
