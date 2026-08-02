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

  return `/images/guitars/${image}`;
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
    setFilters((previous) => {
      const nextFilters = { ...previous, [name]: value };
      const hasActiveFilters = Object.values(nextFilters).some(
        (filterValue) => filterValue.trim() !== "",
      );

      if (!hasActiveFilters) {
        setResult(null);
        setIsLoading(false);
      }

      return nextFilters;
    });
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <article className="min-h-[500px] rounded-xl border border-white/10 bg-white/5 p-5 text-zinc-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
          Visualizador
        </p>

        <div className="mt-4 min-h-[440px] w-full rounded-lg border border-white/10 bg-black/30 p-4">
          {isLoading ? (
            <div className="flex min-h-[408px] w-full flex-col items-center justify-center gap-3 text-zinc-400">
              <span className="h-3 w-3 animate-pulse rounded-full bg-amber-500" />
              <p className="text-sm">Buscando combinacion ideal...</p>
            </div>
          ) : hasResult ? (
            <div className="flex min-h-[408px] w-full flex-col justify-between gap-4">
              <div className="relative h-[340px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                <Image
                  alt={result.name || "Guitarra personalizada"}
                  className="object-contain object-center p-3"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={getImageSrc(result.image)}
                />
              </div>

              <div>
                <p className="text-lg font-semibold text-zinc-100">{result.name}</p>
                <p className="font-mono text-xl font-semibold text-amber-300">
                  {formatCurrency(result.price)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[408px] w-full items-center justify-center rounded-lg border border-dashed border-white/15 bg-black/20 px-6 text-center text-sm text-zinc-400">
              Elegi los selectores para encontrar una guitarra disponible.
            </div>
          )}
        </div>
      </article>

      <article className="rounded-xl border border-white/10 bg-white/5 p-5 text-zinc-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-400">
          Custom Shop Controls
        </p>

        <div className="mt-5 space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Tipo</span>
            <select
              className="w-full rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
            <span className="text-zinc-300">Subtipo</span>
            <select
              className="w-full rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
            <span className="text-zinc-300">Color</span>
            <select
              className="w-full rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
            <span className="text-zinc-300">Orientacion</span>
            <select
              className="w-full rounded-md border border-zinc-800 bg-black/50 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
          className="mt-6 w-full rounded-md bg-amber-600 px-4 py-2 font-medium text-zinc-900 transition-all enabled:hover:bg-amber-500 enabled:hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasResult}
          type="button"
        >
          Anadir al Carrito
        </button>
      </article>
    </section>
  );
}