import GuitarBentoGrid from "@/components/GuitarBentoGrid";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="spring-in relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_22px_50px_rgba(0,0,0,0.38)] backdrop-blur-md [animation-delay:60ms] lg:col-span-8 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_30%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.38em] text-amber-400/90">
                Premium Analog Workshop
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-zinc-50 md:text-5xl">
                Guitarras de autor con presencia de vitrina y carácter de estudio
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300/90 md:text-lg">
                Catálogo curado con instrumentos customizables, donde la madera,
                la forma y el detalle conviven con una lectura visual más limpia
                y editorial.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  Artesanía visual
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  Bento adaptativo
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  Catálogo vivo
                </span>
              </div>
            </div>
          </div>

          <aside className="spring-in relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-zinc-200 shadow-[0_22px_50px_rgba(0,0,0,0.38)] backdrop-blur-md [animation-delay:150ms] lg:col-span-4">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),transparent_42%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.26em] text-amber-500/90">
                Catálogo técnico
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Unidades activas en vitrina y composición visual contenida.
              </p>
              <p className="mt-4 font-mono text-4xl font-semibold text-amber-300">
                {guitars.length.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
                instrumentos publicados
              </p>
            </div>
          </aside>
        </section>

        <section className="spring-in rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_22px_50px_rgba(0,0,0,0.32)] backdrop-blur-md [animation-delay:240ms] md:p-6">
          <GuitarBentoGrid guitars={guitars} />
        </section>
      </div>
    </main>
  );
}
