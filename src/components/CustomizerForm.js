"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const DEFAULT_FILTERS = {
  type: "",
  subtype: "",
  color: "",
  orientation: "",
};

function getImageSrc(image) {
  if (!image) {
    return "";
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/products/${image}`;
}

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `$${value}`;
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function CustomizerForm({ options }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ""),
      ),
    [filters],
  );

  useEffect(() => {
    if (Object.keys(activeFilters).length === 0) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const findMatch = async () => {
      setIsLoading(true);

      try {
        const query = new URLSearchParams(activeFilters).toString();
        const response = await fetch(`/api/guitars/search?${query}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 404) {
          setResult(null);
          return;
        }

        if (!response.ok) {
          throw new Error("No fue posible buscar guitarras");
        }

        const guitar = await response.json();
        setResult(guitar);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResult(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    findMatch();

    return () => {
      controller.abort();
    };
  }, [activeFilters]);

  const hasResult = Boolean(result);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <article className="rounded-xl border border-stone-300 bg-stone-100 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          Visualizador
        </p>

        <div className="mt-4 rounded-lg border border-stone-300 bg-white p-4">
          {isLoading ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-stone-500">
              <span className="h-3 w-3 animate-pulse rounded-full bg-amber-500" />
              <p className="text-sm">Buscando combinacion ideal...</p>
            </div>
          ) : hasResult ? (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                <Image
                  alt={result.name || "Guitarra personalizada"}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={getImageSrc(result.image)}
                />
              </div>

              <div>
                <p className="text-lg font-semibold text-stone-900">{result.name}</p>
                <p className="font-mono text-xl font-semibold text-amber-600">
                  {formatCurrency(result.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[340px] items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 px-6 text-center text-sm text-stone-500">
              Elegi los selectores para encontrar una guitarra disponible.
            </div>
          )}
        </div>
      </article>

      <article className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 text-stone-200 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
          Custom Shop Controls
        </p>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="text-stone-300">Tipo</span>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-stone-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
              name="type"
              onChange={handleFilterChange}
              value={filters.type}
            >
              <option value="">Seleccionar tipo</option>
              {options.types.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-stone-300">Subtipo</span>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-stone-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
              name="subtype"
              onChange={handleFilterChange}
              value={filters.subtype}
            >
              <option value="">Seleccionar subtipo</option>
              {options.subtypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-stone-300">Color</span>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-stone-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
              name="color"
              onChange={handleFilterChange}
              value={filters.color}
            >
              <option value="">Seleccionar color</option>
              {options.colors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-stone-300">Orientacion</span>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-stone-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
              name="orientation"
              onChange={handleFilterChange}
              value={filters.orientation}
            >
              <option value="">Seleccionar orientacion</option>
              {options.orientations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="mt-6 w-full rounded-md bg-amber-600 px-4 py-2 font-medium text-stone-900 transition enabled:hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasResult}
          type="button"
        >
          Anadir al Carrito
        </button>
      </article>
    </section>
  );
}