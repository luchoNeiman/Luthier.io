"use client";

import Link from "next/link";
import { useMemo } from "react"; // es para calcular la cantidad total de items en el carrito

import { useApp } from "@/context/AppContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Colecciones" },
  { href: "/customize", label: "Custom Shop" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { cart, favorites, activeUser, login, logout } = useApp();

  const cartQuantity = useMemo(
    () => cart.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cart],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-stone-300">
        <Link className="logo-color-cycle text-lg font-bold uppercase tracking-widest" href="/">
          LUTHIER.IO
        </Link>

        <div className="flex flex-wrap gap-2 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                className="rounded-md border border-transparent px-3 py-2 text-sm font-medium text-stone-300 transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="rounded-md border border-zinc-700 bg-black/30 px-3 py-1">
              Favoritos: {favorites.length}
            </span>
            <span className="rounded-md border border-zinc-700 bg-black/30 px-3 py-1">
              Usuario: {activeUser ? activeUser.name : "Invitado"}
            </span>

            {activeUser ? (
              <button
                className="rounded-md border border-zinc-700 px-3 py-1 text-zinc-200 transition-colors hover:border-red-400 hover:text-red-300"
                onClick={logout}
                type="button"
              >
                Logout
              </button>
            ) : (
              <button
                className="rounded-md border border-zinc-700 px-3 py-1 text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300"
                onClick={() => login()}
                type="button"
              >
                Login Demo
              </button>
            )}

            <Link
              aria-label="Ir al carrito"
              className="relative ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 bg-black/40 text-zinc-200 transition-colors hover:border-amber-400 hover:text-amber-300"
              href="/cart"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M3 4h2l2.2 10.5a1 1 0 0 0 1 .8h9.9a1 1 0 0 0 1-.8L21 8H7" />
              </svg>
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-zinc-900 bg-amber-500 px-1 text-[10px] font-semibold leading-none text-zinc-950">
                {cartQuantity}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
