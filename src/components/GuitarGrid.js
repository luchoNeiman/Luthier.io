"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function getGuitarImageSrc(image) {
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

function GuitarCard({ guitar }) {
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 35,
  });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const maxTilt = 8;

    setTilt({
      rotateX: (0.5 - py) * maxTilt,
      rotateY: (px - 0.5) * maxTilt,
      glowX: px * 100,
      glowY: py * 100,
    });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 35 });
  }

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 text-zinc-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform duration-300"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-2px)`,
        boxShadow:
          "0 14px 30px rgba(0,0,0,0.35), 0 0 15px rgba(245,158,11,0.18)",
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(245,158,11,0.24), transparent 45%)`,
        }}
      />

      <div className="relative aspect-[3/4] bg-black/20">
        {guitar.image ? (
          <Image
            alt={guitar.name || "Guitarra de Autor Custom"}
            className="object-contain object-center p-3"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={getGuitarImageSrc(guitar.image)}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500">
            Sin imagen
          </div>
        )}
      </div>

      <div className="relative z-10 p-5">
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.15em]">
          {guitar.type ? (
            <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-300">
              {guitar.type}
            </span>
          ) : null}
          {guitar.subtype && guitar.subtype !== "No aplica" ? (
            <span className="rounded-md border border-zinc-700 bg-black/40 px-2 py-1 text-zinc-300">
              {guitar.subtype}
            </span>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h2 className="mt-3 text-lg font-semibold text-zinc-100">
            {guitar.name}
          </h2>
          <p className="mt-3 shrink-0 font-mono text-base font-semibold text-amber-300">
            {formatCurrency(guitar.price)}
          </p>
        </div>

        {guitar.categories?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {guitar.categories.map((category) =>
              typeof category === "string" ? (
                <span
                  key={category}
                  className="rounded-md border border-zinc-700 bg-black/40 px-2 py-1 text-xs font-medium text-zinc-300"
                >
                  {category}
                </span>
              ) : (
                <Link
                  key={category._id}
                  className="rounded-md border border-zinc-700 bg-black/40 px-2 py-1 text-xs font-medium text-zinc-300 transition-all hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300"
                  href={`/category/${category._id}`}
                >
                  {category.name}
                </Link>
              )
            )}
          </div>
        ) : null}

        <p className="mt-4 border-t border-white/10 pt-3 font-mono text-xs uppercase tracking-[0.12em] text-zinc-500">
          Stock: {String(guitar.stock).padStart(2, "0")}
        </p>
      </div>
    </article>
  );
}
