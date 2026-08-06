import GuitarBentoGrid from "@/components/GuitarBentoGrid";
import SplitWorkshopHero from "@/components/home/SplitWorkshopHero";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const guitars = await getGuitars();

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-8">
        <SplitWorkshopHero />

        <section className="spring-in rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_22px_50px_rgba(0,0,0,0.32)] backdrop-blur-md [animation-delay:240ms] md:p-6">
          <GuitarBentoGrid guitars={guitars} />
        </section>
      </div>
    </main>
  );
}
