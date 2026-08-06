"use client";

import { useApp } from "@/context/AppContext";

export default function GuitarDetailActions({ guitar }) {
  const { activeUser, favorites, toggleFavorite, addToCart } = useApp();
  const isFavorite = favorites.includes(guitar._id);

  function handleAddToCart() {
    addToCart(guitar, {
      color: guitar.color || "",
      orientation: guitar.orientation || "",
      type: guitar.type || "",
      subtype: guitar.subtype || "",
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="rounded-md bg-amber-500 px-5 py-2.5 font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
        onClick={handleAddToCart}
        type="button"
      >
        Agregar al carrito
      </button>

      {activeUser ? (
        <button
          className={`rounded-md border px-5 py-2.5 font-medium transition-colors ${
            isFavorite
              ? "border-amber-400 bg-amber-500/15 text-amber-300"
              : "border-white/10 bg-white/5 text-zinc-200 hover:border-amber-500/50 hover:text-amber-300"
          }`}
          onClick={() => toggleFavorite(guitar._id)}
          type="button"
        >
          {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        </button>
      ) : null}
    </div>
  );
}
