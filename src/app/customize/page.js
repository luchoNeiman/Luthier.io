import CustomizerForm from "@/components/CustomizerForm";
import { connectDB } from "@/lib/mongodb";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

function sortAlphabetically(values) {
  return values.filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
}

export default async function CustomizePage() {
  await connectDB();

  const [colors, types, subtypes, orientations] = await Promise.all([
    Guitar.distinct("color"),
    Guitar.distinct("type"),
    Guitar.distinct("subtype"),
    Guitar.distinct("orientation"),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
            Premium Analog Workshop
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-100 md:text-5xl">
            Custom Shop
          </h1>
          <p className="max-w-2xl text-base text-zinc-400">
            Configura tipo, subtipo, color y orientacion para encontrar la
            guitarra que coincide con tu criterio tecnico exacto.
          </p>
        </header>

        <CustomizerForm
          options={{
            colors: sortAlphabetically(colors),
            types: sortAlphabetically(types),
            subtypes: sortAlphabetically(subtypes),
            orientations: sortAlphabetically(orientations),
          }}
        />
      </div>
    </main>
  );
}