import GuitarDashboardContainer from "@/containers/GuitarDashboardContainer";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-4xl font-semibold text-zinc-200 md:text-5xl">
            Panel de Control Luthier
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500 md:text-base">
            Gestion integral del catalogo, stock y colecciones comerciales con
            enfoque operativo para el taller boutique.
          </p>
        </header>

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <GuitarDashboardContainer />
        </section>
      </div>
    </main>
  );
}
