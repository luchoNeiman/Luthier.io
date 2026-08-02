import GuitarGrid from "@/components/GuitarGrid";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="spring-in rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md [animation-delay:60ms] lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
              Premium Analog Workshop
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-zinc-100 md:text-5xl">
              Guitarras de autor para escenarios modernos
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-400">
              Catálogo curado con instrumentos customizables, construidos para
              combinar artesanía clásica y precisión sonora contemporánea.
            </p>
            <p className="mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-zinc-500">
              Atelier sonoro con curaduria boutique
            </p>
          </div>

          <aside className="spring-in rounded-xl border border-white/10 bg-white/5 p-5 text-zinc-200 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md [animation-delay:150ms] lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500">
              Catalogo tecnico
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Unidades activas en vitrina
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold text-amber-300">
              {guitars.length.toString().padStart(2, "0")}
            </p>
          </aside>
        </section>

        <section className="spring-in rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md [animation-delay:240ms] md:p-6">
          <GuitarGrid guitars={guitars} />
        </section>
      </div>
    </main>
  );
}
