import GuitarGrid from "@/components/GuitarGrid";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Programacion 3
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            Guitarras
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Catalogo publico del ecommerce. La administracion queda disponible
            en /dashboard.
          </p>
        </section>

        <GuitarGrid guitars={guitars} />
      </div>
    </main>
  );
}
