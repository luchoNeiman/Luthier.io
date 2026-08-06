"use client";

import { useEffect, useMemo, useState } from "react";

import GuitarGrid from "@/components/GuitarGrid";
import { useApp } from "@/context/AppContext";

export default function FavoritesPage() {
  const { favorites } = useApp();
  const [guitars, setGuitars] = useState([]);

  useEffect(() => {
    async function loadGuitars() {
      const response = await fetch("/api/guitars", { cache: "no-store" });
      const payload = await response.json();

      if (response.ok && Array.isArray(payload)) {
        setGuitars(payload);
      }
    }

    loadGuitars();
  }, []);

  const favoriteGuitars = useMemo(
    () => guitars.filter((guitar) => favorites.includes(guitar._id)),
    [favorites, guitars],
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-400">Favoritos</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Mis Favoritos</h1>
          <p className="mt-2 text-zinc-400">
            Las guitarras favoritas guardadas en tu sesion actual.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-6">
          <GuitarGrid guitars={favoriteGuitars} />
        </section>
      </div>
    </main>
  );
}
