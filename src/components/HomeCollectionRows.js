"use client";

import { useRef } from "react";

import { GuitarCard } from "@/components/GuitarGrid";

export default function HomeCollectionRows({ collections = [] }) {
  if (collections.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400 shadow-sm">
        Todavia no hay colecciones cargadas.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {collections.map((collection) => (
        <CollectionRow key={collection._id} collection={collection} />
      ))}
    </div>
  );
}

function CollectionRow({ collection }) {
  const sliderRef = useRef(null);

  function scrollSlider(direction) {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const cardWidth = 304;
    const gap = 16;
    const step = cardWidth + gap;
    slider.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-md md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-amber-400/90">
            Coleccion
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
              {collection.name}
            </h2>
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
              {collection.guitars.length} piezas
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {collection.description || "Coleccion comercial sin descripcion."}
          </p>
        </div>
      </div>

      <div className="relative mt-5">
        {collection.guitars?.length ? (
          <>
            <button
              aria-label="Ver productos anteriores"
              className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300 md:inline-flex"
              onClick={() => scrollSlider(-1)}
              type="button"
            >
              <span aria-hidden="true">&#10094;</span>
            </button>

            <button
              aria-label="Ver productos siguientes"
              className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300 md:inline-flex"
              onClick={() => scrollSlider(1)}
              type="button"
            >
              <span aria-hidden="true">&#10095;</span>
            </button>
          </>
        ) : null}

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-zinc-950 via-zinc-950/70 to-transparent md:block" />

        {collection.guitars?.length ? (
          <div
            ref={sliderRef}
            className="hide-scrollbar flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [scroll-snap-type:x_mandatory]"
          >
            {collection.guitars.map((guitar) => (
              <GuitarCard
                key={guitar._id}
                className="w-[276px] shrink-0 [scroll-snap-align:start] md:w-[304px]"
                guitar={guitar}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-sm text-zinc-400">
            Esta coleccion todavia no tiene guitarras asociadas.
          </p>
        )}
      </div>
    </section>
  );
}