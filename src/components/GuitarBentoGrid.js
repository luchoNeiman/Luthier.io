"use client";

import { GuitarCard } from "@/components/GuitarGrid";

function getBentoSpanClass(index) {
  if (index === 0 || index === 1) {
    return "md:col-span-6";
  }

  if (index >= 2 && index <= 5) {
    return "md:col-span-3";
  }

  if (index === 6) {
    return "md:col-span-8";
  }

  if (index === 7) {
    return "md:col-span-4";
  }

  if (index >= 8 && index <= 10) {
    return "md:col-span-4";
  }

  return "md:col-span-3";
}

export default function GuitarBentoGrid({ guitars = [] }) {
  if (guitars.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400 shadow-sm">
        Todavia no hay guitarras cargadas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {guitars.map((guitar, index) => (
        <GuitarCard
          key={guitar._id}
          className={`col-span-1 ${getBentoSpanClass(index)}`}
          compact
          guitar={guitar}
        />
      ))}
    </div>
  );
}