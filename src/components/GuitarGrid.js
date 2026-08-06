"use client";

import GuitarCard from "@/components/GuitarCard";

export default function GuitarGrid({ guitars = [] }) {
  if (guitars.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400 shadow-sm">
        Todavia no hay guitarras cargadas.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guitars.map((guitar) => (
        <GuitarCard key={guitar._id} guitar={guitar} />
      ))}
    </div>
  );
}

export { default as GuitarCard } from "@/components/GuitarCard";
