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
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          href="/"
        >
          Volver al catalogo
        </Link>

        <section className="mb-8 mt-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            Categoria
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              {category.description}
            </p>
          ) : null}
        </section>

        <GuitarGrid guitars={guitars} />
      </div>
    </main>
  );
}
