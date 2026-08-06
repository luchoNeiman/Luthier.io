"use client";

import { GuitarCard } from "@/components/GuitarGrid";

const bentoSpans = [
  "xl:col-span-6",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-4",
  "xl:col-span-5",
  "xl:col-span-3",
];

export default function GuitarBentoGrid({ guitars = [] }) {
  if (guitars.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400 shadow-sm">
        Todavia no hay guitarras cargadas.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12 xl:grid-flow-dense">
      {guitars.map((guitar, index) => (
        <GuitarCard
          key={guitar._id}
          className={`h-full ${bentoSpans[index % bentoSpans.length]}`}
          compact
          guitar={guitar}
        />
      ))}
    </div>
  );
}