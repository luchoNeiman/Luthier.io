import GuitarGrid from "@/components/GuitarGrid";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen px-6 py-10 text-stone-800">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
              Premium Analog Workshop
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">
              Guitarras de autor para escenarios modernos
            </h1>
            <p className="mt-4 max-w-2xl text-base text-stone-600">
              Catálogo curado con instrumentos customizables, construidos para
              combinar artesanía clásica y precisión sonora contemporánea.
            </p>
          </div>

          <aside className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-stone-200 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500">
              Catalogo tecnico
            </p>
            <p className="mt-3 text-sm text-stone-300">
              Unidades activas en vitrina
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold text-amber-400">
              {guitars.length.toString().padStart(2, "0")}
            </p>
          </aside>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white/60 p-5 shadow-sm backdrop-blur-sm md:p-6">
          <GuitarGrid guitars={guitars} />
        </section>
      </div>
    </main>
  );
}
