"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

const DEFAULT_FILTERS = {
  type: "",
  subtype: "",
  color: "",
  orientation: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
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
  const { addToCart, cart, clearCart } = useApp();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

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
          setResults([]);
          setActiveResultIndex(0);
          return;
        }

        if (!response.ok) {
          throw new Error("No fue posible buscar guitarras");
        }

        const guitars = await response.json();
        setResults(Array.isArray(guitars) ? guitars : []);
        setActiveResultIndex(0);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
          setActiveResultIndex(0);
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

  const activeResult = results[activeResultIndex] ?? null;
  const hasResult = Boolean(activeResult);
  const hasMultipleResults = results.length > 1;

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((previous) => {
      const nextFilters = { ...previous, [name]: value };
      const hasActiveFilters = Object.values(nextFilters).some(
        (filterValue) => filterValue.trim() !== "",
      );

      setJustAdded(false);

      if (!hasActiveFilters) {
        setResults([]);
        setActiveResultIndex(0);
        setIsLoading(false);
      }

      return nextFilters;
    });
  }

  function handleAddToCart() {
    if (!activeResult) {
      return;
    }

    addToCart(activeResult, {
      color: filters.color || activeResult.color || "",
      orientation: filters.orientation || activeResult.orientation || "",
      type: filters.type || activeResult.type || "",
      subtype: filters.subtype || activeResult.subtype || "",
    });

    setJustAdded(true);
  }

  function handlePreviousResult() {
    setActiveResultIndex((currentIndex) =>
      currentIndex === 0 ? results.length - 1 : currentIndex - 1,
    );
  }

  function handleNextResult() {
    setActiveResultIndex((currentIndex) =>
      currentIndex === results.length - 1 ? 0 : currentIndex + 1,
    );
  }

  const totalCartQuantity = cart.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0,
  );

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
              {hasMultipleResults ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  <button
                    className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 transition-colors hover:border-amber-400 hover:text-amber-300"
                    onClick={handlePreviousResult}
                    type="button"
                  >
                    Anterior
                  </button>
                  <span>
                    Opcion {activeResultIndex + 1} de {results.length}
                  </span>
                  <button
                    className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 transition-colors hover:border-amber-400 hover:text-amber-300"
                    onClick={handleNextResult}
                    type="button"
                  >
                    Siguiente
                  </button>
                </div>
              ) : null}

              <div className="relative h-[340px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                <Image
                  alt={activeResult.name || "Guitarra personalizada"}
                  className="object-contain object-center p-3"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={getImageSrc(activeResult.image)}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-zinc-100">{activeResult.name}</p>
                  <span className="rounded-md border border-zinc-700 bg-black/20 px-2 py-1 text-xs uppercase tracking-[0.15em] text-zinc-400">
                    {activeResult.type}
                    {activeResult.subtype && activeResult.subtype !== "No aplica"
                      ? ` / ${activeResult.subtype}`
                      : ""}
                  </span>
                </div>
                <p className="font-mono text-xl font-semibold text-amber-300">
                  {formatCurrency(activeResult.price)}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {activeResult.brand} · {activeResult.color} · {activeResult.orientation}
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

          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Marca</span>
            <select
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              name="brand"
              onChange={handleFilterChange}
              value={filters.brand}
            >
              <option value="">Seleccionar marca</option>
              {options.brands.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2 text-sm">
              <span className="text-zinc-300">Precio minimo</span>
              <input
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                min="0"
                name="minPrice"
                onChange={handleFilterChange}
                placeholder="0"
                type="number"
                value={filters.minPrice}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-300">Precio maximo</span>
              <input
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                min="0"
                name="maxPrice"
                onChange={handleFilterChange}
                placeholder="999999"
                type="number"
                value={filters.maxPrice}
              />
            </label>
          </div>
        </div>

        <button
          className="mt-6 w-full rounded-md bg-amber-600 px-4 py-2 font-medium text-zinc-900 transition-all enabled:hover:bg-amber-500 enabled:hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasResult}
          onClick={handleAddToCart}
          type="button"
        >
          Anadir al Carrito
        </button>

        {justAdded ? (
          <p className="mt-3 text-sm text-emerald-300">
            Item agregado. Si repetis la misma configuracion, aumenta cantidad.
          </p>
        ) : null}

        <section className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Resumen de carrito
            </p>
            <button
              className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={cart.length === 0}
              onClick={clearCart}
              type="button"
            >
              Vaciar
            </button>
          </div>

          <p className="mt-3 text-sm text-zinc-300">
            Total de unidades: {totalCartQuantity}
          </p>

          {cart.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No hay items en carrito.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {cart.map((item) => (
                <li
                  key={item.cartItemId}
                  className="rounded-md border border-white/10 bg-black/30 p-3"
                >
                  <p className="font-medium text-zinc-100">{item.guitar.name}</p>
                  <p className="text-zinc-400">
                    {item.selectedOptions.type} / {item.selectedOptions.subtype} /{" "}
                    {item.selectedOptions.color} / {item.selectedOptions.orientation}
                  </p>
                  <p className="text-amber-300">Cantidad: {item.quantity}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </section>
  );
}