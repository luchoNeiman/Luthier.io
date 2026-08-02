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
    <main className="min-h-screen px-6 py-10 text-stone-800">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
            Premium Analog Workshop
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">
            Custom Shop
          </h1>
          <p className="max-w-2xl text-base text-stone-600">
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