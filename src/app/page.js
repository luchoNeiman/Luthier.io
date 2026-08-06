import Image from "next/image";
import Link from "next/link";

import GuitarBentoGrid from "@/components/GuitarBentoGrid";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-8">
        

        <section className="group min-h-[80vh] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
          <div className="flex min-h-[80vh] flex-col md:flex-row">
            <div className="flex w-full flex-col justify-center p-12 md:w-3/5 md:p-24">
              <p className="text-xs uppercase tracking-[0.34em] text-amber-400/90">
                The Split Workshop
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-zinc-100 md:text-7xl">
                Artesania en cada nota
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                Instrumentos de luthieria boutique con presencia escenica y
                respuesta tecnica de estudio. Configura cada detalle y descubre
                una guitarra alineada con tu identidad sonora.
              </p>

              <div className="mt-10">
                <Link
                  className="inline-flex rounded-xl border border-amber-500/30 bg-white/5 px-7 py-3.5 text-base font-medium text-zinc-100 backdrop-blur-md transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  href="/customize"
                >
                  Entrar al Custom Shop
                </Link>
              </div>
            </div>

            <div className="relative w-full overflow-hidden border-t border-white/10 md:w-2/5 md:rounded-l-[4rem] md:border-l md:border-t-0 md:border-white/10">
              <Image
                alt="Gold Standard L-Type"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                src="/images/guitars/Gold Standard L-Type.webp"
              />
            </div>
          </div>
        </section>

        <section className="spring-in rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_22px_50px_rgba(0,0,0,0.32)] backdrop-blur-md [animation-delay:240ms] md:p-6">
          <GuitarBentoGrid guitars={guitars} />
        </section>
      </div>
    </main>
  );
}
